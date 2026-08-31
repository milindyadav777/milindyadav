import type { Metadata } from "next";
import SpringLesson, { CodeBlock, ConceptCheck, Practice } from "../SpringLesson";

export const metadata: Metadata = {
  title: "05 — Spring Boot Auto-configuration | Spring Boot Series",
  description:
    "Learn starters, auto-configuration candidates, conditional beans, property matching and Spring Boot's back-off model.",
};

export default function AutoConfigurationPage() {
  return (
    <SpringLesson
      number="05"
      title={<>Let Boot contribute defaults that <em>back off cleanly.</em></>}
      summary="Auto-configuration is conditional configuration supplied by libraries. It observes the classpath, existing beans and properties, then contributes only the definitions whose conditions match."
      outcomes={[
        "distinguish a library, a starter and an auto-configuration",
        "explain how auto-configuration candidates are discovered",
        "evaluate class, bean and property conditions independently",
        "predict when a user-defined bean makes Boot back off",
      ]}
      previous={{ href: "/spring-boot/04-component-scanning-and-bean-creation/", label: "Bean creation" }}
    >
      <section>
        <p className="section-index">Three different pieces</p>
        <h2>A starter brings dependencies; auto-configuration creates conditional beans.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>Library</h3>
            <p>
              Provides classes and behaviour, such as a database driver or email client.
              Adding a library does not necessarily create any Spring beans.
            </p>
          </div>
          <div>
            <h3>Starter</h3>
            <p>
              A dependency descriptor that brings together a compatible set of libraries
              for one capability.
            </p>
          </div>
          <div>
            <h3>Auto-configuration</h3>
            <p>
              Configuration classes that create useful default beans when their
              conditions match.
            </p>
          </div>
        </div>
        <p>
          This is why adding one dependency can change startup behaviour: a class that
          was absent is now present, so a classpath condition may begin to match.
        </p>
        <CodeBlock label="One capability, three layers">{`notification-client.jar
    provides EmailClient

notification-spring-boot-autoconfigure.jar
    provides NotificationAutoConfiguration

notification-spring-boot-starter
    depends on both jars for convenience`}</CodeBlock>
        <p>
          A project can use the client library manually without Spring. It can use the
          auto-configuration with explicitly chosen dependencies. The starter simply
          makes the common combination easy to declare.
        </p>
        <ConceptCheck question="If a starter is added, must its default bean be created?">
          <p>
            No. The starter makes classes available. Auto-configuration still evaluates
            its conditions. A disabled property, missing prerequisite or user-defined
            replacement can prevent the default bean from being registered.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Candidate discovery</p>
        <h2>Auto-configuration is imported, not found by your component scan.</h2>
        <p>
          <code>@EnableAutoConfiguration</code>, included by{" "}
          <code>@SpringBootApplication</code>, asks Boot to load candidate configuration
          classes. A reusable library lists those candidates in:
        </p>
        <CodeBlock label="AutoConfiguration.imports">{`META-INF/spring/
└── org.springframework.boot.autoconfigure.AutoConfiguration.imports`}</CodeBlock>
        <CodeBlock label="File contents">{`com.example.notification.NotificationAutoConfiguration`}</CodeBlock>
        <p>
          The configuration class is marked <code>@AutoConfiguration</code>. Merely
          placing it under <code>com.example.orders</code> is not the registration
          mechanism for a reusable auto-configuration.
        </p>
        <p>
          This matters because library authors cannot predict the package of every
          consuming application. Package scanning is controlled by the application; the
          imports file is controlled by the library and travels inside its jar.
        </p>
        <CodeBlock label="Typical reusable module layout">{`notification-spring-boot-autoconfigure/
└── src/main/
    ├── java/com/example/notification/
    │   └── NotificationAutoConfiguration.java
    └── resources/META-INF/spring/
        └── org.springframework.boot.autoconfigure.AutoConfiguration.imports`}</CodeBlock>
        <ol className="spring-flow-list">
          <li>
            <span>01</span>
            <div>
              <h3>The application enables auto-configuration</h3>
              <p><code>@SpringBootApplication</code> includes that opt-in.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Boot reads candidate imports</h3>
              <p>Every participating library can contribute configuration class names.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Conditions filter candidates and bean methods</h3>
              <p>Unavailable or unwanted configurations do not contribute definitions.</p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <h3>Matching definitions join the same context</h3>
              <p>
                Application components and auto-configured infrastructure are wired
                together through normal dependency injection.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section>
        <p className="section-index">Conditions</p>
        <h2>Every declared condition must match.</h2>
        <div className="spring-definition-list">
          <div>
            <h3>@ConditionalOnClass</h3>
            <p>Create the configuration only when a required library class is available.</p>
          </div>
          <div>
            <h3>@ConditionalOnMissingBean</h3>
            <p>Provide a default only when the application has not already supplied that bean type.</p>
          </div>
          <div>
            <h3>@ConditionalOnProperty</h3>
            <p>Enable or disable configuration from an external property and its missing-value rule.</p>
          </div>
        </div>
        <CodeBlock label="A conditional default">{`@Bean
@ConditionalOnMissingBean(NotificationSender.class)
@ConditionalOnProperty(
        prefix = "orders.notification",
        name = "enabled",
        havingValue = "true",
        matchIfMissing = true
)
public NotificationSender notificationSender() {
    return new EmailNotificationSender();
}`}</CodeBlock>
        <p>
          Here, <code>true</code> matches, <code>false</code> does not, and a missing
          property also matches because <code>matchIfMissing</code> is{" "}
          <code>true</code>.
        </p>
        <p>
          Read conditions as predicates. The class-level condition controls whether the
          configuration is relevant at all. Method-level conditions control whether one
          particular bean definition should be added.
        </p>
        <CodeBlock label="The combined decision">{`createDefaultSender =
        emailClientIsPresent
        && propertyAllowsNotifications
        && noNotificationSenderBeanExists;`}</CodeBlock>
        <div className="spring-comparison-table-wrap">
          <table className="spring-comparison-table">
            <thead>
              <tr>
                <th>EmailClient</th>
                <th>enabled property</th>
                <th>Existing sender</th>
                <th>Create default email?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Present</td>
                <td>Missing</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Present</td>
                <td>true</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Present</td>
                <td>false</td>
                <td>No</td>
                <td>No: property condition fails.</td>
              </tr>
              <tr>
                <td>Present</td>
                <td>Missing</td>
                <td>SMS bean</td>
                <td>No: missing-bean condition fails.</td>
              </tr>
              <tr>
                <td>Absent</td>
                <td>true</td>
                <td>No</td>
                <td>No: class condition fails.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ConceptCheck question="Why does a missing property enable this feature?">
          <p>
            Only because this annotation explicitly sets{" "}
            <code>matchIfMissing = true</code>. That encodes an enabled-by-default
            policy. With the default <code>false</code>, a missing property would not
            match. Always read the missing-value rule instead of guessing from the
            property name.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Walk through four startups</p>
        <h2>The same auto-configuration can produce different contexts.</h2>
        <div className="spring-scenario-list">
          <div>
            <span>Scenario A</span>
            <h3>Library present, property missing, no user bean</h3>
            <p>
              All conditions match. The context receives one default{" "}
              <code>EmailNotificationSender</code>.
            </p>
          </div>
          <div>
            <span>Scenario B</span>
            <h3>Library present, property set to false, no user bean</h3>
            <p>
              The property condition fails. The auto-configuration creates no sender. If
              another bean requires <code>NotificationSender</code>, that separate
              dependency may now make startup fail.
            </p>
          </div>
          <div>
            <span>Scenario C</span>
            <h3>Library present, property missing, user supplies SMS</h3>
            <p>
              The missing-bean condition fails. The default email definition backs off,
              leaving the user&apos;s SMS implementation.
            </p>
          </div>
          <div>
            <span>Scenario D</span>
            <h3>Email client library absent</h3>
            <p>
              The class condition prevents this configuration from applying. Other
              notification auto-configurations could still be evaluated independently.
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="section-index">Back-off</p>
        <h2>User configuration has the final say.</h2>
        <p>
          <code>@ConditionalOnMissingBean</code> is the central back-off mechanism. The
          auto-configuration offers a useful default, while an application can replace
          that default simply by defining its own bean. No framework source code needs to
          be edited.
        </p>
        <CodeBlock label="The consuming application overrides the default">{`@Configuration(proxyBeanMethods = false)
class ApplicationNotificationConfiguration {

    @Bean
    NotificationSender notificationSender() {
        return new SmsNotificationSender();
    }
}`}</CodeBlock>
        <p>
          The application does not call or subclass the auto-configuration. Its bean
          definition is visible when the conditional default is evaluated, so
          <code>@ConditionalOnMissingBean</code> does not match.
        </p>
        <p>
          Back-off is more maintainable than “create both and mark one primary.” It
          prevents an unwanted default from existing at all and lets a reusable library
          remain opinionated without becoming rigid.
        </p>
        <ConceptCheck question="Does a user bean have to use the same bean name as the default?">
          <p>
            Not for this condition. It checks for the{" "}
            <code>NotificationSender</code> type, so an SMS bean with any name makes the
            default back off. A condition configured specifically by name would behave
            differently.
          </p>
        </ConceptCheck>
      </section>

      <section>
        <p className="section-index">Component scan versus auto-configuration</p>
        <h2>Both register beans, but they discover definitions differently.</h2>
        <div className="spring-comparison-table-wrap">
          <table className="spring-comparison-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Component scanning</th>
                <th>Auto-configuration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Who normally owns the class?</td>
                <td>The application</td>
                <td>A framework or reusable library</td>
              </tr>
              <tr>
                <td>How is it discovered?</td>
                <td>Package scan below the application root</td>
                <td>AutoConfiguration.imports</td>
              </tr>
              <tr>
                <td>What usually controls registration?</td>
                <td>Component stereotype and scan boundary</td>
                <td>Classpath, bean, property and other conditions</td>
              </tr>
              <tr>
                <td>Typical example</td>
                <td><code>OrderService</code></td>
                <td>Default data source or client infrastructure</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Once registered, both kinds of definitions participate in the same container.
          Constructor injection does not care whether a bean originated from scanning,
          an application <code>@Bean</code> method or auto-configuration.
        </p>
      </section>

      <section>
        <p className="section-index">Diagnosing decisions</p>
        <h2>The condition evaluation report explains why configurations matched.</h2>
        <p>
          When startup behaviour is surprising, run with <code>--debug</code> or set{" "}
          <code>debug=true</code>. The condition evaluation report shows positive and
          negative matches and the reason for each decision.
        </p>
        <CodeBlock label="Simplified report reasoning">{`Positive matches:
  NotificationAutoConfiguration
    - EmailClient was found
    - orders.notification.enabled was missing
      and matchIfMissing was true

Negative matches:
  notificationSender
    - NotificationSender bean already existed`}</CodeBlock>
        <p>
          A negative match is not necessarily an error. Back-off intentionally appears as
          a negative match. Read the reason before excluding an auto-configuration or
          adding annotations to force it.
        </p>
        <div className="spring-mistake-note">
          <h3>Common debugging mistake</h3>
          <p>
            Seeing that a class is on the classpath and assuming its bean must exist.
            Class presence may satisfy only one of several conditions.
          </p>
        </div>
      </section>

      <Practice
        time="Suggested time: 12 minutes"
        hints={
          <ol>
            <li>Put the classpath condition on the auto-configuration class.</li>
            <li>Put the missing-bean and property conditions on the bean method.</li>
            <li>All conditions are combined with logical AND.</li>
            <li>A user-defined <code>SmsNotificationSender</code> still counts as a <code>NotificationSender</code> bean.</li>
          </ol>
        }
        solution={
          <>
            <CodeBlock label="NotificationAutoConfiguration.java">{`package com.example.notification;

import com.example.email.EmailClient;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnClass(EmailClient.class)
public class NotificationAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(NotificationSender.class)
    @ConditionalOnProperty(
            prefix = "orders.notification",
            name = "enabled",
            havingValue = "true",
            matchIfMissing = true
    )
    public NotificationSender notificationSender() {
        return new EmailNotificationSender();
    }
}`}</CodeBlock>
            <CodeBlock label="AutoConfiguration.imports">{`com.example.notification.NotificationAutoConfiguration`}</CodeBlock>
            <div className="spring-condition-result">
              <h3>Scenario result</h3>
              <ol>
                <li><strong>OnClass:</strong> matches because <code>EmailClient</code> is present.</li>
                <li><strong>OnProperty:</strong> matches because the property is missing and <code>matchIfMissing = true</code>.</li>
                <li><strong>OnMissingBean:</strong> does not match because the user&apos;s SMS bean implements <code>NotificationSender</code>.</li>
              </ol>
              <p>
                The conditions are ANDed, so the email bean is not created. The final
                context contains the user-defined SMS <code>NotificationSender</code>,
                not both implementations.
              </p>
            </div>
          </>
        }
      >
        <p>
          Write an auto-configuration that creates an email{" "}
          <code>NotificationSender</code> only when:
        </p>
        <ol>
          <li><code>EmailClient</code> is on the classpath.</li>
          <li>No <code>NotificationSender</code> bean already exists.</li>
          <li><code>orders.notification.enabled</code> is true or missing.</li>
        </ol>
        <p>
          Then evaluate this scenario: <code>EmailClient</code> is present, the property
          is missing, and the application defines an SMS bean that implements{" "}
          <code>NotificationSender</code>. State each condition result and the final
          beans in the context.
        </p>
      </Practice>

      <section className="spring-recap">
        <p className="section-index">Foundation check</p>
        <h2>Component scanning and auto-configuration solve different discovery problems.</h2>
        <p>
          Component scanning finds your annotated application classes below a package
          root. Auto-configuration imports library-provided candidates and then filters
          them with conditions. Both can contribute beans to the same context.
        </p>
      </section>
    </SpringLesson>
  );
}
