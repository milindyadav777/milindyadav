import type { Metadata } from "next";
import SpringLesson, { CodeBlock, ConceptCheck, Practice } from "../SpringLesson";

export const metadata: Metadata = {
  title: "03 — Beans and Constructor Injection | Spring Boot Series",
  description:
    "Learn Spring beans, component stereotypes, constructor injection, @Primary, @Qualifier and CommandLineRunner.",
};

export default function BeansAndInjectionPage() {
  return (
    <SpringLesson
      number="03"
      title={<>Let Spring create objects and <em>inject their dependencies.</em></>}
      summary="The design from module 1 stays the same: OrderService depends on NotificationSender. The difference is that Spring now discovers the classes, creates the objects and calls the constructors."
      outcomes={[
        "define a Spring bean and distinguish it from an ordinary Java object",
        "use stereotypes and single-constructor injection",
        "diagnose an ambiguous dependency",
        "select a default with @Primary and an explicit implementation with @Qualifier",
      ]}
      previous={{ href: "/spring-boot/02-first-application/", label: "First Boot application" }}
      next={{ href: "/spring-boot/04-component-scanning-and-bean-creation/", label: "Bean creation" }}
    >
      <section>
        <p className="section-index">Bean basics</p>
        <h2>A bean is an object managed by the Spring container.</h2>
        <p>
          A bean definition tells Spring how to create an object. The resulting bean
          instance can then be injected into another bean. By default, a bean is a
          singleton <em>within one ApplicationContext and one bean definition</em>; this
          is not the same as a JVM-wide Singleton-pattern object.
        </p>
        <div className="spring-definition-list">
          <div>
            <h3>@Component</h3>
            <p>A general-purpose class that component scanning should register.</p>
          </div>
          <div>
            <h3>@Service</h3>
            <p>A component whose role is application or business service logic.</p>
          </div>
          <div>
            <h3>@Repository</h3>
            <p>A persistence component. Its additional database behaviour matters later in this series.</p>
          </div>
        </div>
        <p>
          These stereotypes describe roles; <code>@Service</code> and{" "}
          <code>@Repository</code> are specialised forms of <code>@Component</code>.
        </p>
        <p>
          It helps to separate two things that are often both called “a bean.” A{" "}
          <strong>bean definition</strong> is Spring&apos;s recipe: type, name, scope and
          construction information. A <strong>bean instance</strong> is the actual Java
          object created from that recipe.
        </p>
        <CodeBlock label="A scanned definition becomes an instance">{`@Service
public class OrderService {
    // Spring registers a bean definition while scanning.
    // During context refresh, it creates the OrderService object.
}`}</CodeBlock>
        <div className="spring-example-grid">
          <div>
            <h3>Registration phase</h3>
            <p>
              Spring scans metadata and records that an <code>OrderService</code> bean
              can be created.
            </p>
          </div>
          <div>
            <h3>Instantiation phase</h3>
            <p>
              Spring calls the constructor after it has worked out what every parameter
              should receive.
            </p>
          </div>
        </div>
        <p>
          Component scanning does not inject an annotation into the object. It discovers
          a class, registers a definition, and later creates and wires the object through
          normal Java constructors.
        </p>
      </section>

      <section>
        <p className="section-index">What makes a bean different?</p>
        <h2>The Java object is ordinary; container ownership adds behaviour around it.</h2>
        <CodeBlock label="Manual object">{`OrderService service =
        new OrderService(notificationSender);`}</CodeBlock>
        <CodeBlock label="Container-managed object">{`@Service
public class OrderService {
    public OrderService(NotificationSender notificationSender) {
        // Spring calls this same Java constructor.
    }
}`}</CodeBlock>
        <p>
          Both values are instances of the same Java class. The second is a bean because
          the context owns its creation, dependency resolution, scope and lifecycle.
          Annotating a class does not prevent manual construction, although a manually
          created instance is not automatically registered with Spring.
        </p>
        <ConceptCheck question="If code calls new OrderService(...), will @Service make that object a bean?">
          <p>
            No. <code>@Service</code> lets scanning register a bean definition. Only the
            instance created through that definition is container-managed. A separate
            object created with <code>new</code> remains an ordinary object unless it is
            explicitly registered.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Constructor injection</p>
        <h2>The constructor makes required dependencies explicit.</h2>
        <CodeBlock label="OrderService.java">{`package com.example.orders.service;

import org.springframework.stereotype.Service;
import com.example.orders.notification.NotificationSender;

@Service
public class OrderService {
    private final NotificationSender notificationSender;

    public OrderService(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }
}`}</CodeBlock>
        <p>
          Spring sees one constructor, resolves its parameters from the context and calls
          it. <code>@Autowired</code> is unnecessary when a class has a single constructor.
          The <code>final</code> field prevents the required dependency from being
          replaced after construction.
        </p>
        <CodeBlock label="How Spring reasons about the constructor">{`OrderService(
    NotificationSender notificationSender
)

// Question Spring asks:
// "Which bean in this context can satisfy NotificationSender?"`}</CodeBlock>
        <p>
          Injection is primarily type-based. Spring does not care about the local field
          name when one unique bean satisfies the type. It first identifies the
          constructor, then resolves each parameter, then invokes the constructor with
          those instances.
        </p>
        <div className="spring-example-grid">
          <div>
            <p className="section-index">One constructor</p>
            <h3>No @Autowired required</h3>
            <p>Spring uses the only available constructor.</p>
          </div>
          <div>
            <p className="section-index">Several constructors</p>
            <h3>The choice must be unambiguous</h3>
            <p>
              Mark the intended injectable constructor or redesign the alternatives so
              construction is clear.
            </p>
          </div>
        </div>
        <CodeBlock label="Why field injection hides information">{`@Service
public class OrderService {
    @Autowired
    private NotificationSender notificationSender;
}`}</CodeBlock>
        <p>
          A normal Java caller can construct this class without setting the field, so the
          object is temporarily incomplete. The dependency is also absent from the public
          construction contract. Constructor injection avoids both problems.
        </p>
      </section>

      <section>
        <p className="section-index">Multiple implementations</p>
        <h2>Matching the type is necessary, but sometimes not sufficient.</h2>
        <p>
          If email and SMS beans both implement <code>NotificationSender</code>, an
          unqualified injection point has two candidates. Spring knows the required type
          but cannot infer the business decision.
        </p>
        <CodeBlock label="Default and explicit selection">{`@Component
@Primary
public class EmailNotificationSender implements NotificationSender {
    // ...
}

@Component
@Qualifier("sms")
public class SmsNotificationSender implements NotificationSender {
    // ...
}

public OtpService(
        @Qualifier("sms") NotificationSender notificationSender
) {
    this.notificationSender = notificationSender;
}`}</CodeBlock>
        <ul>
          <li><code>@Primary</code> marks email as the default candidate.</li>
          <li><code>@Qualifier(&quot;sms&quot;)</code> explicitly narrows the OTP dependency to SMS.</li>
          <li>An explicit qualifier wins over the primary choice at that injection point.</li>
        </ul>
        <p>
          A parameter name can sometimes act as a fallback when it exactly matches a bean
          name and parameter-name metadata is present. That is a fragile place to encode a
          business rule; use a qualifier when the choice matters.
        </p>
        <div className="spring-comparison-table-wrap">
          <table className="spring-comparison-table">
            <thead>
              <tr>
                <th>Candidates for NotificationSender</th>
                <th>Injection point</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>None</td>
                <td>Unqualified</td>
                <td>Startup fails: the required dependency is missing.</td>
              </tr>
              <tr>
                <td>Email only</td>
                <td>Unqualified</td>
                <td>Email is injected because the type has one candidate.</td>
              </tr>
              <tr>
                <td>Email + SMS</td>
                <td>Unqualified</td>
                <td>Startup fails unless one candidate is preferred.</td>
              </tr>
              <tr>
                <td>Email @Primary + SMS</td>
                <td>Unqualified</td>
                <td>Email is injected.</td>
              </tr>
              <tr>
                <td>Email @Primary + SMS @Qualifier(&quot;sms&quot;)</td>
                <td>@Qualifier(&quot;sms&quot;)</td>
                <td>SMS is injected; the explicit qualifier narrows the candidates.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Think of <code>@Primary</code> as the answer to “which candidate should be the
          general default?” Think of <code>@Qualifier</code> as part of the injection
          point&apos;s requirement: “I need the SMS-flavoured candidate here.”
        </p>
        <ConceptCheck question="Does @Primary cause Spring to create the email bean first?">
          <p>
            No. Primary affects candidate selection for a single-valued injection point;
            it is not an eager-ordering annotation. Both email and SMS bean definitions
            can still exist, and both instances can be created. Primary decides which one
            is selected when the injection point does not narrow the choice.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Bean names and qualifier labels</p>
        <h2>A default bean name and a semantic qualifier are related but distinct.</h2>
        <CodeBlock label="Default names from component classes">{`@Component
public class EmailNotificationSender { }
// default bean name: emailNotificationSender

@Component
@Qualifier("sms")
public class SmsNotificationSender { }
// default bean name: smsNotificationSender
// qualifier metadata: sms`}</CodeBlock>
        <p>
          Spring normally converts the class name to lower camel case for the default
          bean name. <code>@Qualifier(&quot;sms&quot;)</code> adds selection metadata; it does not
          rename the bean to <code>sms</code>. An injection point with the same qualifier
          selects candidates carrying that label.
        </p>
        <CodeBlock label="Naming a bean is a different operation">{`@Component("smsSender")
public class SmsNotificationSender
        implements NotificationSender {
}
// explicit bean name: smsSender`}</CodeBlock>
        <p>
          Bean-name fallback can occasionally make a parameter named{" "}
          <code>smsNotificationSender</code> resolve successfully. That couples the
          choice to a local variable name and compiler metadata. For an intentional
          business distinction such as “OTP must use SMS,” a qualifier communicates the
          rule directly.
        </p>
        <ConceptCheck question="What if an injection point requests @Qualifier(&quot;push&quot;) but email is @Primary?">
          <p>
            Startup fails if no candidate has the <code>push</code> qualifier. The
            explicit qualifier narrows the acceptable set; <code>@Primary</code> does not
            override a requirement that no bean satisfies.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Scope and identity</p>
        <h2>Default singleton means one instance per definition per context.</h2>
        <CodeBlock label="Two consumers receive the same default bean instance">{`@Service
class OrderService {
    OrderService(NotificationSender sender) { /* ... */ }
}

@Service
class ReceiptService {
    ReceiptService(NotificationSender sender) { /* ... */ }
}

// If email is the selected singleton bean, both constructors
// receive the same email bean object in this ApplicationContext.`}</CodeBlock>
        <p>
          This is a container scope, not a JVM-wide guarantee. A second{" "}
          <code>ApplicationContext</code> creates its own singleton. Two different bean
          definitions can also produce two instances of the same Java class.
        </p>
        <CodeBlock label="Two definitions, therefore two managed instances">{`@Bean
NotificationSender customerEmailSender() {
    return new EmailNotificationSender();
}

@Bean
NotificationSender operationsEmailSender() {
    return new EmailNotificationSender();
}`}</CodeBlock>
      </section>

      <section>
        <p className="section-index">Run code after startup</p>
        <h2>CommandLineRunner is itself a bean.</h2>
        <p>
          Boot calls every <code>CommandLineRunner</code> after the context has started.
          A runner is useful for this non-web learning application because it lets us
          exercise injected services without manually asking the context for them.
        </p>
        <CodeBlock label="The container creates the whole path">{`EmailNotificationSender
        ↓ injected into
OrderService
        ↓ injected into
DemoRunner
        ↓ invoked by Boot after startup`}</CodeBlock>
        <p>
          If any arrow cannot be resolved, the context fails before{" "}
          <code>DemoRunner.run</code> is called. That fail-fast behaviour keeps an
          application from accepting work with an incomplete object graph.
        </p>
      </section>

      <Practice
        time="Suggested time: 20 minutes"
        hints={
          <ol>
            <li>Place every class below <code>com.example.orders</code> so it is scanned.</li>
            <li>Make email <code>@Primary</code>; give SMS the qualifier <code>sms</code>.</li>
            <li>Put <code>@Qualifier(&quot;sms&quot;)</code> on the <code>OtpService</code> constructor parameter.</li>
            <li>Inject both services into a <code>CommandLineRunner</code> component.</li>
          </ol>
        }
        solution={
          <>
            <CodeBlock label="notification package">{`// NotificationSender.java
package com.example.orders.notification;

public interface NotificationSender {
    void send(String destination, String message);
}

// EmailNotificationSender.java
package com.example.orders.notification;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class EmailNotificationSender implements NotificationSender {
    @Override
    public void send(String destination, String message) {
        System.out.println("EMAIL to " + destination + ": " + message);
    }
}

// SmsNotificationSender.java
package com.example.orders.notification;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("sms")
public class SmsNotificationSender implements NotificationSender {
    @Override
    public void send(String destination, String message) {
        System.out.println("SMS to " + destination + ": " + message);
    }
}`}</CodeBlock>
            <CodeBlock label="service package">{`// OrderService.java
package com.example.orders.service;

import org.springframework.stereotype.Service;
import com.example.orders.notification.NotificationSender;

@Service
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

// OtpService.java
package com.example.orders.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import com.example.orders.notification.NotificationSender;

@Service
public class OtpService {
    private final NotificationSender notificationSender;

    public OtpService(
            @Qualifier("sms") NotificationSender notificationSender
    ) {
        this.notificationSender = notificationSender;
    }

    public void sendOtp(String destination, String otp) {
        notificationSender.send(destination, "OTP: " + otp);
    }
}`}</CodeBlock>
            <CodeBlock label="DemoRunner.java">{`package com.example.orders.runner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.orders.service.OrderService;
import com.example.orders.service.OtpService;

@Component
public class DemoRunner implements CommandLineRunner {
    private final OrderService orderService;
    private final OtpService otpService;

    public DemoRunner(OrderService orderService, OtpService otpService) {
        this.orderService = orderService;
        this.otpService = otpService;
    }

    @Override
    public void run(String... args) {
        orderService.placeOrder("ORD-201", "customer@example.com");
        otpService.sendOtp("+919876543210", "482731");
    }
}`}</CodeBlock>
            <CodeBlock label="Expected output">{`EMAIL to customer@example.com: Order ORD-201 placed successfully
SMS to +919876543210: OTP: 482731`}</CodeBlock>
          </>
        }
      >
        <p>Extend the order application with two notification implementations.</p>
        <ul>
          <li>Email must be the default for <code>OrderService</code>.</li>
          <li><code>OtpService</code> must always request SMS explicitly.</li>
          <li>A runner must invoke both services after startup.</li>
          <li>Include correct package declarations and imports; the submission must compile as written.</li>
        </ul>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Failure diagnosis</p>
        <h2>What happens if both implementations have only @Component?</h2>
        <p>
          Startup fails at the unqualified <code>OrderService</code> injection point
          because two beans satisfy <code>NotificationSender</code>. The failure happens
          while Spring creates the context, before the runner executes.
        </p>
      </section>
    </SpringLesson>
  );
}
