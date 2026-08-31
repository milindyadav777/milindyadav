import type { Metadata } from "next";
import SpringLesson, { CodeBlock, Practice } from "../SpringLesson";

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
      </section>

      <section>
        <p className="section-index">Run code after startup</p>
        <h2>CommandLineRunner is itself a bean.</h2>
        <p>
          Boot calls every <code>CommandLineRunner</code> after the context has started.
          A runner is useful for this non-web learning application because it lets us
          exercise injected services without manually asking the context for them.
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
