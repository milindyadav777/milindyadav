import type { Metadata } from "next";
import SpringLesson, { CodeBlock, ConceptCheck, Practice } from "../SpringLesson";

export const metadata: Metadata = {
  title: "04 — Component Scanning and Bean Creation | Spring Boot Series",
  description:
    "Learn component scan boundaries, explicit @Bean methods, @Configuration proxy behaviour and injectable java.time.Clock design.",
};

export default function BeanCreationPage() {
  return (
    <SpringLesson
      number="04"
      title={<>Understand how Spring <em>finds and creates beans.</em></>}
      summary="Stereotypes are convenient for application classes, but not every dependency can or should be annotated. Explicit configuration gives the application a clear place to construct third-party and policy-driven objects."
      outcomes={[
        "state exactly which packages the default component scan searches",
        "choose between a component stereotype and an explicit @Bean method",
        "use method-parameter injection safely with proxyBeanMethods=false",
        "inject Clock so time-dependent code is deterministic and testable",
      ]}
      previous={{ href: "/spring-boot/03-beans-and-injection/", label: "Beans and injection" }}
      next={{ href: "/spring-boot/05-auto-configuration/", label: "Auto-configuration" }}
    >
      <section>
        <p className="section-index">Discovery boundary</p>
        <h2>Component scanning starts at the application package.</h2>
        <p>
          With <code>OrdersApplication</code> in{" "}
          <code>com.example.orders</code>, the default scan searches that package and
          every subpackage. It finds classes such as:
        </p>
        <CodeBlock label="Inside the default scan">{`com.example.orders.notification.EmailNotificationSender
com.example.orders.service.OrderService
com.example.orders.configuration.TimeConfiguration
com.example.orders.runner.DemoRunner`}</CodeBlock>
        <p>
          It does not automatically scan a sibling such as{" "}
          <code>com.example.payments</code>. Put the application class at a sensible
          package root instead of widening the scan without a reason.
        </p>
        <p>
          Scanning reads class metadata. It is looking for component stereotypes and
          configuration classes, not for every Java class in the package. An unannotated
          DTO in the same folder is visible to Java but does not become a bean merely
          because the scanner passed over it.
        </p>
        <CodeBlock label="Same package, different result">{`package com.example.orders;

@Service
class OrderService { }
// registered by component scanning

class CreateOrderRequest { }
// ordinary class; no bean definition is registered`}</CodeBlock>
        <ConceptCheck question="Does component scanning create every object immediately?">
          <p>
            No. Scanning primarily discovers and registers bean definitions. During
            context refresh, Spring normally creates non-lazy singleton instances from
            those definitions. Other scopes or lazy beans can be instantiated later.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Two creation paths</p>
        <h2>Use scanning for your components and @Bean for explicit construction.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>Stereotype annotation</h3>
            <p>
              Use <code>@Component</code>, <code>@Service</code> or{" "}
              <code>@Repository</code> when you own the class and its role belongs in
              the application.
            </p>
          </div>
          <div>
            <h3>@Bean factory method</h3>
            <p>
              Use a method in <code>@Configuration</code> when the class comes from a
              library, construction needs explicit values, or the application should own
              the creation policy.
            </p>
          </div>
        </div>
        <CodeBlock label="Explicit bean definitions">{`@Configuration(proxyBeanMethods = false)
public class TimeConfiguration {

    @Bean
    public Clock applicationClock() {
        return Clock.systemUTC();
    }

    @Bean
    public OrderTimestampService orderTimestampService(
            Clock applicationClock
    ) {
        return new OrderTimestampService(applicationClock);
    }
}`}</CodeBlock>
        <p>
          The default bean names here are <code>applicationClock</code> and{" "}
          <code>orderTimestampService</code>, taken from the method names. Spring resolves
          the <code>Clock</code> parameter before invoking the second method.
        </p>
        <p>
          <code>@Configuration</code> is itself a component stereotype, so the scan finds{" "}
          <code>TimeConfiguration</code>. Spring then processes its{" "}
          <code>@Bean</code> methods as additional definitions.
        </p>
        <ol className="spring-flow-list">
          <li>
            <span>01</span>
            <div>
              <h3>Find TimeConfiguration</h3>
              <p>The default component scan discovers the configuration class.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Register both method definitions</h3>
              <p>
                The declared return types tell Spring that a <code>Clock</code> and an{" "}
                <code>OrderTimestampService</code> can be created.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Resolve method parameters</h3>
              <p>
                Spring finds the managed <code>Clock</code> before calling the service
                factory method.
              </p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <h3>Register returned objects as beans</h3>
              <p>The object returned from each method is managed by the context.</p>
            </div>
          </li>
        </ol>
      </section>

      <section>
        <p className="section-index">Choosing the creation path</p>
        <h2>The decision is about ownership and construction, not class importance.</h2>
        <div className="spring-comparison-table-wrap">
          <table className="spring-comparison-table">
            <thead>
              <tr>
                <th>Object</th>
                <th>Likely definition style</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>OrderService</code></td>
                <td><code>@Service</code></td>
                <td>You own the application class and its service role is clear.</td>
              </tr>
              <tr>
                <td><code>Clock</code></td>
                <td><code>@Bean</code></td>
                <td>It is a JDK class and cannot be edited to add a Spring annotation.</td>
              </tr>
              <tr>
                <td>Vendor SDK client</td>
                <td><code>@Bean</code></td>
                <td>Construction needs credentials, endpoints or a builder you control.</td>
              </tr>
              <tr>
                <td><code>CreateOrderRequest</code></td>
                <td>Neither</td>
                <td>Each request is ordinary input data, not a shared collaborator.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Avoid defining the same application service both with <code>@Service</code> and
          an unrelated <code>@Bean</code> method unless two distinct definitions are
          intentional. Otherwise the context may contain two candidates of the same type
          and injection becomes ambiguous.
        </p>
        <CodeBlock label="Accidental duplicate definitions">{`@Service
class OrderService { }

@Bean
OrderService orderService() {
    return new OrderService();
}

// These are two bean definitions, not two annotations
// describing one shared instance.`}</CodeBlock>
      </section>

      <section>
        <p className="section-index">proxyBeanMethods</p>
        <h2>With proxies disabled, direct method calls are ordinary Java calls.</h2>
        <p>
          <code>@Configuration(proxyBeanMethods = false)</code> avoids method
          interception. It is efficient and clear when bean methods are independent or
          receive other beans as parameters.
        </p>
        <CodeBlock label="Prefer parameter injection">{`// Correct: Spring supplies its managed TokenGenerator bean.
@Bean
public OtpService otpService(TokenGenerator tokenGenerator) {
    return new OtpService(tokenGenerator);
}

// Risky with proxyBeanMethods = false:
@Bean
public OtpService anotherOtpService() {
    return new OtpService(tokenGenerator());
    // tokenGenerator() is a normal Java call and creates another instance.
}`}</CodeBlock>
        <p>
          The default <code>@Configuration</code> mode uses a proxy that can intercept
          calls between <code>@Bean</code> methods and return the managed bean. Parameter
          injection works in either mode and states the dependency more directly.
        </p>
        <div className="spring-example-grid">
          <div>
            <p className="section-index">proxyBeanMethods = true</p>
            <h3>Inter-bean calls are intercepted</h3>
            <p>
              A direct call such as <code>tokenGenerator()</code> can be redirected to
              the context&apos;s managed singleton.
            </p>
          </div>
          <div>
            <p className="section-index">proxyBeanMethods = false</p>
            <h3>Methods have normal Java semantics</h3>
            <p>
              Calling <code>tokenGenerator()</code> executes its body and constructs
              whatever that method normally returns.
            </p>
          </div>
        </div>
        <CodeBlock label="See the duplicate construction explicitly">{`@Configuration(proxyBeanMethods = false)
class TokenConfiguration {

    @Bean
    TokenGenerator tokenGenerator() {
        return new TokenGenerator();
    }

    @Bean
    OtpService otpService() {
        return new OtpService(tokenGenerator());
    }
}

// Context bean A: created from tokenGenerator()
// Plain object B: created when otpService() calls tokenGenerator()
// OtpService receives B, not the managed bean A.`}</CodeBlock>
        <CodeBlock label="One managed instance in either proxy mode">{`@Bean
OtpService otpService(TokenGenerator tokenGenerator) {
    return new OtpService(tokenGenerator);
}`}</CodeBlock>
        <ConceptCheck question="Does proxyBeanMethods=false change Spring's default singleton scope?">
          <p>
            No. The registered <code>tokenGenerator</code> bean is still a singleton by
            default. The extra object appears only because ordinary Java code calls the
            factory method directly. Method-parameter injection asks the container for
            the managed bean and avoids that second construction.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Managed and ordinary objects</p>
        <h2>Spring should manage services and infrastructure, not every object.</h2>
        <p>
          Spring-managed objects participate in injection, scopes and lifecycle
          callbacks. Short-lived domain values—request DTOs, entities, value objects and
          exceptions—are normally created by application or persistence code. They do
          not need to be fetched from the <code>ApplicationContext</code>.
        </p>
        <p>
          When a managed service needs another managed object, constructor injection is
          the normal path. Direct context access remains an integration escape hatch, not
          the default application design.
        </p>
        <div className="spring-example-grid">
          <div>
            <p className="section-index">Usually managed</p>
            <h3>Collaborators and infrastructure</h3>
            <p>
              Services, repositories, clients, clocks, transaction infrastructure and
              configuration-driven strategies.
            </p>
          </div>
          <div>
            <p className="section-index">Usually ordinary</p>
            <h3>Values and per-operation state</h3>
            <p>
              DTOs, entities, order lines, identifiers, exceptions and local
              collections.
            </p>
          </div>
        </div>
        <CodeBlock label="Creation location determines ownership">{`@Bean
Clock applicationClock() {
    return Clock.systemUTC();
}
// The returned Clock is a bean because Spring invokes
// this definition and registers the result.

Instant timestamp = applicationClock.instant();
// The Instant is a normal value returned during business work.
// It does not become a bean.`}</CodeBlock>
        <p>
          Calling <code>new</code> inside a <code>@Bean</code> method is completely
          normal: the returned object is precisely what Spring is being asked to manage.
          Calling <code>new</code> inside a service for one of its required collaborators
          bypasses injection and recreates the coupling from module 1.
        </p>
      </section>

      <section>
        <p className="section-index">Inject time</p>
        <h2>Clock turns the current time into a replaceable dependency.</h2>
        <CodeBlock label="A deterministic Clock">{`Clock fixedClock = Clock.fixed(
        Instant.parse("2026-08-31T00:00:00Z"),
        ZoneOffset.UTC
);`}</CodeBlock>
        <p>
          <code>Clock.fixed(...)</code> always returns the same instant. That is useful in
          this learning checkpoint and in tests. A production bean usually returns{" "}
          <code>Clock.systemUTC()</code>, while a test configuration supplies a fixed
          clock.
        </p>
        <CodeBlock label="The service has no idea which clock it received">{`public class OrderTimestampService {
    private final Clock clock;

    public OrderTimestampService(Clock clock) {
        this.clock = clock;
    }

    public Instant currentTimestamp() {
        return clock.instant();
    }
}`}</CodeBlock>
        <div className="spring-example-grid spring-example-grid-three">
          <div>
            <h3>System UTC</h3>
            <CodeBlock>{`Clock.systemUTC()`}</CodeBlock>
            <p>Returns the current real time in UTC.</p>
          </div>
          <div>
            <h3>Fixed</h3>
            <CodeBlock>{`Clock.fixed(
    instant,
    ZoneOffset.UTC
)`}</CodeBlock>
            <p>Always returns one instant, ideal for deterministic assertions.</p>
          </div>
          <div>
            <h3>Offset</h3>
            <CodeBlock>{`Clock.offset(
    baseClock,
    Duration.ofMinutes(5)
)`}</CodeBlock>
            <p>Returns time shifted from another clock.</p>
          </div>
        </div>
        <CodeBlock label="A test without waiting for real time">{`Clock testClock = Clock.fixed(
        Instant.parse("2026-08-31T00:00:00Z"),
        ZoneOffset.UTC
);
OrderTimestampService service =
        new OrderTimestampService(testClock);

assertEquals(
        Instant.parse("2026-08-31T00:00:00Z"),
        service.currentTimestamp()
);`}</CodeBlock>
        <p>
          The service is tested as plain Java. Spring configuration decides which clock
          production receives; the class itself remains independent of the container.
        </p>
      </section>

      <section>
        <p className="section-index">When direct context access is justified</p>
        <h2>Use ApplicationContext at integration boundaries, not as hidden injection.</h2>
        <div className="spring-comparison-table-wrap">
          <table className="spring-comparison-table">
            <thead>
              <tr>
                <th>Situation</th>
                <th>Normal choice</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A service always needs one repository</td>
                <td>Constructor injection</td>
                <td>The dependency is stable and known when the service is created.</td>
              </tr>
              <tr>
                <td>Bootstrapping framework integration</td>
                <td>Context access may be reasonable</td>
                <td>The boundary&apos;s job may be to connect Spring with external lifecycle code.</td>
              </tr>
              <tr>
                <td>Runtime plugin chosen from an open-ended set</td>
                <td>Dynamic lookup may be reasonable</td>
                <td>The exact implementation may genuinely be unknown at construction time.</td>
              </tr>
              <tr>
                <td>A method hides <code>getBean</code> for convenience</td>
                <td>Avoid it</td>
                <td>It hides dependencies and couples ordinary business code to Spring.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Even dynamic selection often has a cleaner injectable form, such as injecting a
          map of strategies into a dedicated registry. Reach for the context only when
          the boundary truly needs container-level behaviour.
        </p>
      </section>

      <Practice
        time="Suggested time: 15 minutes"
        hints={
          <ol>
            <li><code>OrderTimestampService</code> needs imports for both <code>Clock</code> and <code>Instant</code>.</li>
            <li>Create the clock and service through two <code>@Bean</code> methods.</li>
            <li>Inject <code>Clock</code> as a parameter to the service bean method; do not call <code>applicationClock()</code>.</li>
            <li>Add <code>OrderTimestampService</code> to all three places in the runner constructor: parameter, assignment and field.</li>
          </ol>
        }
        solution={
          <>
            <CodeBlock label="OrderTimestampService.java">{`package com.example.orders.time;

import java.time.Clock;
import java.time.Instant;

public class OrderTimestampService {
    private final Clock applicationClock;

    public OrderTimestampService(Clock applicationClock) {
        this.applicationClock = applicationClock;
    }

    public Instant currentTimestamp() {
        return applicationClock.instant();
    }
}`}</CodeBlock>
            <CodeBlock label="TimeConfiguration.java">{`package com.example.orders.configuration;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.orders.time.OrderTimestampService;

@Configuration(proxyBeanMethods = false)
public class TimeConfiguration {

    @Bean
    public Clock applicationClock() {
        return Clock.fixed(
                Instant.parse("2026-08-31T00:00:00Z"),
                ZoneOffset.UTC
        );
    }

    @Bean
    public OrderTimestampService orderTimestampService(
            Clock applicationClock
    ) {
        return new OrderTimestampService(applicationClock);
    }
}`}</CodeBlock>
            <CodeBlock label="DemoRunner.java">{`package com.example.orders.runner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.orders.service.OrderService;
import com.example.orders.service.OtpService;
import com.example.orders.time.OrderTimestampService;

@Component
public class DemoRunner implements CommandLineRunner {
    private final OrderService orderService;
    private final OtpService otpService;
    private final OrderTimestampService orderTimestampService;

    public DemoRunner(
            OrderService orderService,
            OtpService otpService,
            OrderTimestampService orderTimestampService
    ) {
        this.orderService = orderService;
        this.otpService = otpService;
        this.orderTimestampService = orderTimestampService;
    }

    @Override
    public void run(String... args) {
        orderService.placeOrder("ORD-201", "customer@example.com");
        otpService.sendOtp("+919876543210", "482731");
        System.out.println(
                "TIMESTAMP: " + orderTimestampService.currentTimestamp()
        );
    }
}`}</CodeBlock>
            <CodeBlock label="Additional output">{`TIMESTAMP: 2026-08-31T00:00:00Z`}</CodeBlock>
          </>
        }
      >
        <p>Add deterministic timestamps to the existing non-web application.</p>
        <ul>
          <li>Create an <code>OrderTimestampService</code> that depends on <code>Clock</code>.</li>
          <li>Define a fixed UTC clock and the service in explicit configuration.</li>
          <li>Keep <code>proxyBeanMethods = false</code>.</li>
          <li>Print the timestamp from the existing runner.</li>
        </ul>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Foundation check</p>
        <h2>Who owns each object?</h2>
        <p>
          Spring owns the configured <code>Clock</code> and{" "}
          <code>OrderTimestampService</code> beans. The <code>Instant</code> returned by
          the service is an ordinary value object created by the clock; it is not a bean.
        </p>
      </section>
    </SpringLesson>
  );
}
