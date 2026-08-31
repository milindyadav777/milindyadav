import type { Metadata } from "next";
import SpringLesson, { CodeBlock, Practice } from "../SpringLesson";

export const metadata: Metadata = {
  title: "01 — Why Spring Exists | Spring Boot Series",
  description:
    "Learn tight coupling, dependency inversion, dependency injection, composition roots and where Spring's ApplicationContext fits.",
};

export default function WhySpringPage() {
  return (
    <SpringLesson
      number="01"
      title={<>Why Spring exists: <em>separate use from creation.</em></>}
      summary="Spring is easiest to understand after seeing the wiring problem it solves in plain Java. The central idea is that a class should use its dependencies without deciding which concrete implementations to create."
      outcomes={[
        "identify tight coupling caused by constructing a concrete dependency",
        "separate dependency inversion from dependency injection",
        "use constructor injection and recognise a composition root",
        "explain why business code normally does not call ApplicationContext.getBean()",
      ]}
      next={{ href: "/spring-boot/02-first-application/", label: "First Boot application" }}
    >
      <section>
        <p className="section-index">Start with the problem</p>
        <h2>The dependent class is making two decisions.</h2>
        <p>
          This version of <code>OrderService</code> both places an order and chooses how
          notifications are sent:
        </p>
        <CodeBlock label="Tightly coupled OrderService">{`public class OrderService {
    private final EmailNotificationSender notificationSender =
            new EmailNotificationSender();

    public void placeOrder(String orderId, String destination) {
        notificationSender.send(
                destination,
                "Order " + orderId + " placed successfully"
        );
    }
}`}</CodeBlock>
        <p>
          The service is coupled to <code>EmailNotificationSender</code>. Replacing email
          with SMS requires editing the service, and an isolated test cannot provide a
          harmless fake sender. The problem is not the <code>new</code> keyword by itself;
          it is <em>where the concrete choice is made</em>.
        </p>
      </section>

      <section>
        <p className="section-index">Three related ideas</p>
        <h2>DIP changes the direction. DI supplies the object.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>Dependency inversion principle</h3>
            <p>
              High-level policy such as <code>OrderService</code> depends on an
              abstraction such as <code>NotificationSender</code>, not directly on email
              or SMS.
            </p>
          </div>
          <div>
            <h3>Dependency injection</h3>
            <p>
              The dependency is supplied from outside, usually through the constructor.
              The service does not construct the object it depends on.
            </p>
          </div>
          <div>
            <h3>Inversion of control</h3>
            <p>
              Object creation and wiring move out of business classes. Plain Java can do
              this manually; Spring later acts as the container that performs the wiring.
            </p>
          </div>
        </div>
        <CodeBlock label="The service depends on a contract">{`public interface NotificationSender {
    void send(String destination, String message);
}

public class OrderService {
    private final NotificationSender notificationSender;

    public OrderService(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }
}`}</CodeBlock>
      </section>

      <section>
        <p className="section-index">Where new belongs</p>
        <h2>The outer edge assembles the object graph.</h2>
        <p>
          In a plain Java program, <code>Application</code> can be the
          <strong> composition root</strong>: the one place that chooses concrete
          implementations and connects them.
        </p>
        <CodeBlock label="Manual dependency injection">{`public class Application {
    public static void main(String[] args) {
        NotificationSender sender = new EmailNotificationSender();
        OrderService orderService = new OrderService(sender);

        orderService.placeOrder("ORD-101", "customer@example.com");
    }
}`}</CodeBlock>
        <p>
          Creating the concrete object here does not make <code>OrderService</code>{" "}
          tightly coupled. The composition root is supposed to know the implementations.
          If selection later becomes complex, configuration or a factory can centralise
          it without changing the service.
        </p>
      </section>

      <section>
        <p className="section-index">Where ApplicationContext fits</p>
        <h2>Spring becomes the composition root, not a global object lookup.</h2>
        <p>
          A Spring <code>ApplicationContext</code> creates and connects managed objects.
          Controllers and services normally receive dependencies through constructors;
          they do not call <code>applicationContext.getBean(...)</code>. Doing that makes
          dependencies hidden and turns the context into a service locator.
        </p>
        <p>
          Direct context access is mostly for bootstrap code, framework integration,
          specialised tests, legacy boundaries or genuinely dynamic plugin lookup. Also,
          not every object belongs in the context: DTOs, JPA entities, value objects and
          exceptions are commonly created with <code>new</code>.
        </p>
      </section>

      <Practice
        time="Suggested time: 12 minutes"
        hints={
          <ol>
            <li>Put the shared <code>send</code> operation in an interface.</li>
            <li>Make the <code>OrderService</code> constructor accept that interface.</li>
            <li>Let <code>Application.main</code> choose and construct email and SMS implementations.</li>
          </ol>
        }
        solution={
          <>
            <CodeBlock label="Four separate Java files">{`// NotificationSender.java
public interface NotificationSender {
    void send(String destination, String message);
}

// EmailNotificationSender.java
public class EmailNotificationSender implements NotificationSender {
    @Override
    public void send(String destination, String message) {
        System.out.println("EMAIL to " + destination + ": " + message);
    }
}

// SmsNotificationSender.java
public class SmsNotificationSender implements NotificationSender {
    @Override
    public void send(String destination, String message) {
        System.out.println("SMS to " + destination + ": " + message);
    }
}

// OrderService.java
public class OrderService {
    private final NotificationSender notificationSender;

    public OrderService(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }

    public void placeOrder(String orderId, String destination) {
        notificationSender.send(
                destination,
                "Order " + orderId + " placed successfully"
        );
    }
}

// Application.java
public class Application {
    public static void main(String[] args) {
        NotificationSender email = new EmailNotificationSender();
        NotificationSender sms = new SmsNotificationSender();

        new OrderService(email).placeOrder(
                "ORD-101",
                "customer@example.com"
        );
        new OrderService(sms).placeOrder(
                "ORD-102",
                "+919876543210"
        );
    }
}`}</CodeBlock>
            <p>
              The important result is not merely the interface. The service no longer
              creates a concrete sender, and the constructor makes its dependency visible.
            </p>
          </>
        }
      >
        <p>
          Refactor a tightly coupled <code>OrderService</code> so the same class can send
          order confirmations through either email or SMS.
        </p>
        <ul>
          <li>Create the contract and two implementations.</li>
          <li>Use constructor injection.</li>
          <li>Create two differently wired services in <code>Application.main</code>.</li>
          <li>Do not use Spring yet.</li>
        </ul>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Foundation check</p>
        <h2>Can you explain this without saying “Spring does it”?</h2>
        <p>
          Constructor injection is a Java design technique. Spring automates the object
          creation and wiring, but the loose coupling comes from the dependency boundary
          you designed.
        </p>
      </section>
    </SpringLesson>
  );
}
