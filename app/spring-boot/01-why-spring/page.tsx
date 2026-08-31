import type { Metadata } from "next";
import SpringLesson, { CodeBlock, ConceptCheck, Practice } from "../SpringLesson";

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
        <p>
          Read the code from the service&apos;s point of view. To place one order it now
          needs to know that email exists, how an email sender is constructed and that
          email is the policy currently chosen by the application. Those are wiring
          decisions, not order-placement decisions.
        </p>
        <div className="spring-example-grid">
          <div>
            <p className="section-index">Business responsibility</p>
            <h3>What should happen?</h3>
            <p>After an order is accepted, send a confirmation to its destination.</p>
          </div>
          <div>
            <p className="section-index">Construction responsibility</p>
            <h3>Which object should do it?</h3>
            <p>Use email today, perhaps SMS tomorrow, and construct the chosen client.</p>
          </div>
        </div>
        <p>
          Tight coupling appears because both responsibilities are inside the same class.
          The cost becomes visible when requirements change: adding SMS, recording sent
          messages in a test, or wrapping the sender with retry logic all require changes
          to <code>OrderService</code>.
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
        <p>
          The dependency arrow now points from the high-level service to a stable
          capability—<code>NotificationSender</code>. Email and SMS also depend on that
          same contract by implementing it. The interface belongs near the policy that
          needs the capability; it is not merely a shared folder for implementation
          classes.
        </p>
        <ConceptCheck question="Are DIP, DI and IoC three names for the same thing?">
          <p>
            No. DIP is a design principle about which direction source-code dependencies
            should point. DI is a technique for supplying an object&apos;s dependencies.
            IoC is the broader transfer of construction and lifecycle control to an
            outside assembler. Constructor injection can satisfy DI in plain Java; Spring
            later supplies the IoC container.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">A tempting half-fix</p>
        <h2>Declaring the field as an interface is not enough.</h2>
        <p>
          This code looks more abstract because the field type is an interface, but the
          service still names and creates the concrete email class:
        </p>
        <CodeBlock label="An abstraction without injection">{`public class OrderService {
    private final NotificationSender notificationSender =
            new EmailNotificationSender();

    // ...
}`}</CodeBlock>
        <p>
          The compile-time dependency on <code>EmailNotificationSender</code> remains
          because of the constructor call. The service cannot receive SMS or a test fake.
          Dependency injection is missing: nobody outside the service gets a chance to
          supply the dependency.
        </p>
        <CodeBlock label="The dependency is actually injected">{`public class OrderService {
    private final NotificationSender notificationSender;

    public OrderService(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }
}`}</CodeBlock>
        <p>
          Now construction cannot finish without a sender. That is useful: the class
          cannot exist in an invalid, partially initialised state, and every caller can
          see the requirement in the constructor signature.
        </p>
      </section>

      <section>
        <p className="section-index">Why constructor injection</p>
        <h2>The dependency becomes required, visible and stable.</h2>
        <div className="spring-example-grid spring-example-grid-three">
          <div>
            <h3>Required</h3>
            <p>The constructor must receive a sender before the service can be used.</p>
          </div>
          <div>
            <h3>Visible</h3>
            <p>A caller or test can discover dependencies without reading private fields.</p>
          </div>
          <div>
            <h3>Stable</h3>
            <p>A <code>final</code> field prevents replacement after construction.</p>
          </div>
        </div>
        <p>
          Setter injection can be useful for a genuinely optional, reconfigurable
          collaborator. Field injection hides the requirement from normal Java callers
          and makes isolated tests awkward. For required services, constructor injection
          is the default we will use throughout this series.
        </p>
        <CodeBlock label="Two valid object graphs from the same service class">{`NotificationSender email = new EmailNotificationSender();
OrderService emailOrders = new OrderService(email);

NotificationSender sms = new SmsNotificationSender();
OrderService smsOrders = new OrderService(sms);`}</CodeBlock>
        <p>
          An <strong>object graph</strong> is simply the connected set of runtime objects.
          The two graphs above contain the same service type but different concrete
          dependencies. No condition or notification-specific branch was added to the
          service.
        </p>
      </section>

      <section>
        <p className="section-index">Where new belongs</p>
        <h2>The outer edge assembles the object graph.</h2>
        <p>
          In a plain Java program, <code>Application</code> can be the{" "}
          <strong>composition root</strong>: the one place that chooses concrete
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
        <p>
          The composition root is intentionally coupled to concrete implementations. Its
          job is to know what the rest of the application should not need to know. A
          small command-line program may use <code>main</code>; a Spring application uses
          configuration and the container.
        </p>
        <CodeBlock label="Configuration chooses; the service only uses">{`public class NotificationSenderFactory {
    public NotificationSender create(String channel) {
        return switch (channel) {
            case "email" -> new EmailNotificationSender();
            case "sms" -> new SmsNotificationSender();
            default -> throw new IllegalArgumentException(
                    "Unknown channel: " + channel
            );
        };
    }
}

public class Application {
    public static void main(String[] args) {
        String channel = System.getenv()
                .getOrDefault("NOTIFICATION_CHANNEL", "email");

        NotificationSender sender =
                new NotificationSenderFactory().create(channel);
        OrderService orderService = new OrderService(sender);
    }
}`}</CodeBlock>
        <p>
          The factory is not automatically superior to direct construction. It becomes
          useful when selection has real logic. The important boundary remains unchanged:
          <code>OrderService</code> receives a ready-to-use
          {" "}<code>NotificationSender</code>.
        </p>
        <ConceptCheck question="What if Application also sends notifications in several places?">
          <p>
            Keep those variables typed as <code>NotificationSender</code> and centralise
            the concrete choice once. Repeating <code>new EmailNotificationSender()</code>
            throughout bootstrap code spreads the policy. A configuration method or
            factory can create one object and pass it to every dependent object. The root
            may know the concrete class; business classes should not need to.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">The testing payoff</p>
        <h2>A fake dependency can observe behaviour without sending anything.</h2>
        <p>
          Because the constructor accepts the contract, a unit test can provide a tiny
          implementation that records the call:
        </p>
        <CodeBlock label="A plain Java test fake">{`public class RecordingNotificationSender
        implements NotificationSender {

    private String destination;
    private String message;

    @Override
    public void send(String destination, String message) {
        this.destination = destination;
        this.message = message;
    }

    public String destination() {
        return destination;
    }

    public String message() {
        return message;
    }
}`}</CodeBlock>
        <CodeBlock label="Testing OrderService without Spring">{`@Test
void placesOrderAndSendsConfirmation() {
    RecordingNotificationSender sender =
            new RecordingNotificationSender();
    OrderService service = new OrderService(sender);

    service.placeOrder("ORD-101", "customer@example.com");

    assertEquals(
            "customer@example.com",
            sender.destination()
    );
    assertEquals(
            "Order ORD-101 placed successfully",
            sender.message()
    );
}`}</CodeBlock>
        <p>
          This test does not start Spring and does not contact an email system. That is a
          direct benefit of the design boundary. Spring will automate production wiring,
          but ordinary Java construction remains available for focused unit tests.
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
        <div className="spring-example-grid">
          <div>
            <p className="section-index">Normal application code</p>
            <CodeBlock>{`private final NotificationSender sender;

public OrderService(
        NotificationSender sender
) {
    this.sender = sender;
}`}</CodeBlock>
            <p>The dependency is explicit and easy to replace in a test.</p>
          </div>
          <div>
            <p className="section-index">Service-locator style</p>
            <CodeBlock>{`NotificationSender sender =
        context.getBean(
                NotificationSender.class
        );`}</CodeBlock>
            <p>The dependency is hidden inside a method and the class now knows Spring.</p>
          </div>
        </div>
        <p>
          Framework bootstrap code may legitimately hold the context. A plugin host may
          need runtime lookup when the implementation is not knowable at construction
          time. Those are specialised boundaries. A regular controller-to-service flow
          should use injection.
        </p>
      </section>

      <section>
        <p className="section-index">Not every new is a design problem</p>
        <h2>Manage long-lived collaborators; construct ordinary values normally.</h2>
        <CodeBlock label="Ordinary object creation is still ordinary Java">{`OrderId orderId = new OrderId("ORD-101");
Order order = new Order(orderId, customerId);
List<OrderLine> lines = new ArrayList<>();
IllegalArgumentException error =
        new IllegalArgumentException("orderId is required");`}</CodeBlock>
        <p>
          These objects represent data, domain state or a local collection. They are not
          application-wide collaborators with configuration and lifecycle needs. In
          contrast, an email client, repository, clock or service is often shared,
          configured and injected.
        </p>
        <ConceptCheck question="Should a JPA entity be injected from ApplicationContext?">
          <p>
            Normally no. An entity represents a particular database row or new domain
            instance. Application or persistence code creates and loads many of them.
            Services and repositories are container-managed collaborators; the entities
            they process are ordinary domain objects.
          </p>
        </ConceptCheck>
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
            <CodeBlock label="Five separate Java files">{`// NotificationSender.java
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
