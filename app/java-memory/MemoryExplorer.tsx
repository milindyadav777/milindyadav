"use client";

import { useMemo, useState } from "react";

type RegionId =
  | "thread-stack"
  | "pc-register"
  | "native-stack"
  | "heap"
  | "string-pool"
  | "integer-cache"
  | "thread-local"
  | "runtime-constant-pool"
  | "method-area"
  | "metaspace"
  | "code-cache"
  | "direct-memory";

type Model = "spec" | "hotspot";

type Region = {
  id: RegionId;
  title: string;
  short: string;
  scope: string;
  contains: string;
  lifetime: string;
  nuance: string;
};

const regions: Record<RegionId, Region> = {
  "thread-stack": {
    id: "thread-stack",
    title: "JVM stack and frames",
    short: "locals · operands · calls",
    scope: "One stack per thread",
    contains:
      "Each active method call has a frame with local-variable slots, an operand stack, return state and a link to the current class's runtime constant pool.",
    lifetime:
      "A frame is pushed when a method starts and discarded when it returns or exits with an uncaught exception.",
    nuance:
      "A local variable such as receipt usually holds a reference in the frame. The Receipt object itself is normally in the heap.",
  },
  "pc-register": {
    id: "pc-register",
    title: "Program counter register",
    short: "current JVM instruction",
    scope: "One per thread",
    contains:
      "The position of the JVM instruction currently being executed by that thread.",
    lifetime: "Created and destroyed with the thread.",
    nuance:
      "The JVM specification leaves the value undefined while the thread is executing a native method.",
  },
  "native-stack": {
    id: "native-stack",
    title: "Native method stack",
    short: "JNI · operating-system calls",
    scope: "Usually one per thread",
    contains:
      "Call state used by native methods, JNI and implementation code written outside Java.",
    lifetime: "Bound to the thread and managed by the JVM and operating system.",
    nuance:
      "This is separate from both Java method frames and the shared Java heap.",
  },
  heap: {
    id: "heap",
    title: "Java heap",
    short: "objects · arrays · futures",
    scope: "Shared by all threads",
    contains:
      "The lab instance, records, BigDecimal values, CompletableFuture, ConcurrentHashMap nodes, executor objects, Class mirrors and almost every other Java object or array.",
    lifetime:
      "Objects are reclaimed when the garbage collector proves that they are no longer reachable from GC roots.",
    nuance:
      "Static fields are class state, but their exact storage is implementation-specific. Static references such as RECEIPTS still point to ordinary heap objects. HotSpot may also eliminate some allocations through escape analysis.",
  },
  "string-pool": {
    id: "string-pool",
    title: "String intern pool",
    short: "canonical String objects",
    scope: "Shared heap objects",
    contains:
      "One canonical String object for each interned value. The literal checkout is interned automatically; the dynamic key is interned explicitly.",
    lifetime:
      "Canonical String objects are ordinary heap objects. Pool-table and reclamation details depend on the JVM implementation.",
    nuance:
      "Interning unbounded request data is usually a poor production design. This example does it only to expose the memory mechanism.",
  },
  "integer-cache": {
    id: "integer-cache",
    title: "Integer cache",
    short: "reused wrapper objects",
    scope: "Shared heap objects",
    contains:
      "Reusable Integer instances. Java guarantees identity reuse for constant values from −128 through 127 when boxing; HotSpot can cache a wider positive range.",
    lifetime:
      "The cache is initialized with Integer class state and normally remains strongly reachable for the JVM lifetime.",
    nuance:
      "RETRY_LIMIT refers to the cached Integer for 3. Assigning it to int performs unboxing inside the executing method frame.",
  },
  "thread-local": {
    id: "thread-local",
    title: "ThreadLocal state",
    short: "per-thread association",
    scope: "Heap state owned by each Thread",
    contains:
      "ThreadLocal keys and values are tracked through a ThreadLocalMap associated with the current Thread object.",
    lifetime:
      "The association can remain as long as the worker thread does, which is especially important for executor pools.",
    nuance:
      "ThreadLocal values are not stored on the JVM stack. The finally block calls remove() to prevent stale request context from leaking into later tasks.",
  },
  "runtime-constant-pool": {
    id: "runtime-constant-pool",
    title: "Runtime constant pool",
    short: "constants · symbolic references",
    scope: "One per loaded class or interface",
    contains:
      "Numeric constants and symbolic references to classes, fields, methods, string literals, method handles and invokedynamic call sites.",
    lifetime: "Created when the JVM creates the class or interface.",
    nuance:
      "It is not the String pool. A CONSTANT_String entry can resolve to an interned String object in the heap.",
  },
  "method-area": {
    id: "method-area",
    title: "Method area",
    short: "logical class-level storage",
    scope: "Shared logical JVM area",
    contains:
      "Per-class structures such as runtime constant pools, field and method descriptions, and code for methods and constructors.",
    lifetime: "Class-level data remains associated with the loaded type until class unloading.",
    nuance:
      "The method area is a specification concept, not a requirement that all of this data occupy one physical memory region.",
  },
  metaspace: {
    id: "metaspace",
    title: "HotSpot Metaspace",
    short: "native class metadata",
    scope: "Native memory outside the Java heap",
    contains:
      "HotSpot's native representation of class metadata, organized around class-loader data structures.",
    lifetime:
      "It grows as classes load and can be reclaimed when class loaders and their classes become eligible for unloading.",
    nuance:
      "Metaspace is one HotSpot realization of part of the logical method area. It is not a synonym for every method-area structure.",
  },
  "code-cache": {
    id: "code-cache",
    title: "JIT code cache",
    short: "compiled machine code",
    scope: "Native memory outside the Java heap",
    contains:
      "Native machine code generated for hot methods and call sites, together with stubs and supporting compiled-code metadata.",
    lifetime:
      "Compiled methods can be installed, invalidated, deoptimized and replaced as runtime profiling changes.",
    nuance:
      "The supplyAsync lambda begins as bytecode-linked behaviour. Hot execution may cause its target code to be compiled here.",
  },
  "direct-memory": {
    id: "direct-memory",
    title: "Direct and native memory",
    short: "off-heap byte storage",
    scope: "Native memory outside the Java heap",
    contains:
      "The 4 KiB payload requested by ByteBuffer.allocateDirect, plus native allocations made by the JVM, JNI and libraries.",
    lifetime:
      "The DirectByteBuffer wrapper is a heap object. Its native payload is released through JVM-managed cleanup after the wrapper becomes unreachable.",
    nuance:
      "A small Java heap does not imply a small process. Thread stacks, Metaspace, the code cache and direct buffers all contribute to resident memory.",
  },
};

const codeLines: Array<{ number: number; text: string; region: RegionId }> = [
  { number: 14, text: "public final class JvmMemoryLab implements AutoCloseable {", region: "method-area" },
  { number: 15, text: "    private static final String SERVICE = \"checkout\";", region: "string-pool" },
  { number: 16, text: "    private static final Integer RETRY_LIMIT = Integer.valueOf(3);", region: "integer-cache" },
  { number: 17, text: "    private static final ConcurrentMap<String, Receipt> RECEIPTS =", region: "heap" },
  { number: 18, text: "            new ConcurrentHashMap<>();", region: "heap" },
  { number: 19, text: "    private static final ThreadLocal<RequestContext> CONTEXT =", region: "thread-local" },
  { number: 20, text: "            new ThreadLocal<>();", region: "thread-local" },
  { number: 22, text: "    private final ExecutorService executor = Executors.newFixedThreadPool(2);", region: "heap" },
  { number: 24, text: "    public sealed interface Command permits Charge {}", region: "method-area" },
  { number: 26, text: "    public record Charge(long orderId, BigDecimal amount) implements Command {", region: "method-area" },
  { number: 35, text: "    public record Receipt(String key, BigDecimal amount, Instant createdAt) {}", region: "method-area" },
  { number: 37, text: "    private record RequestContext(UUID traceId, ByteBuffer scratch) {}", region: "method-area" },
  { number: 39, text: "    public CompletableFuture<Receipt> execute(Charge command) {", region: "thread-stack" },
  { number: 42, text: "        return CompletableFuture.supplyAsync(() -> {", region: "code-cache" },
  { number: 43, text: "            RequestContext context = new RequestContext(", region: "heap" },
  { number: 44, text: "                    UUID.randomUUID(), ByteBuffer.allocateDirect(4_096));", region: "direct-memory" },
  { number: 45, text: "            CONTEXT.set(context);", region: "thread-local" },
  { number: 48, text: "                String key = (SERVICE + ':' + command.orderId()).intern();", region: "string-pool" },
  { number: 49, text: "                int attempt = RETRY_LIMIT;", region: "integer-cache" },
  { number: 50, text: "                context.scratch().putInt(attempt);", region: "direct-memory" },
  { number: 52, text: "                Receipt receipt = new Receipt(", region: "heap" },
  { number: 53, text: "                        key, command.amount(), Instant.now());", region: "runtime-constant-pool" },
  { number: 54, text: "                RECEIPTS.put(key, receipt);", region: "heap" },
  { number: 55, text: "                return receipt;", region: "thread-stack" },
  { number: 57, text: "                CONTEXT.remove();", region: "thread-local" },
  { number: 59, text: "        }, executor);", region: "thread-stack" },
  { number: 70, text: "                    new Charge(42L, new BigDecimal(\"199.99\"))).join();", region: "heap" },
  { number: 71, text: "            System.out.println(receipt);", region: "runtime-constant-pool" },
];

const groups: Array<{ title: string; note: string; ids: RegionId[] }> = [
  {
    title: "Per thread",
    note: "Private execution state",
    ids: ["pc-register", "thread-stack", "native-stack"],
  },
  {
    title: "Java heap",
    note: "Shared, garbage-collected objects",
    ids: ["heap", "string-pool", "integer-cache", "thread-local"],
  },
  {
    title: "Class-level runtime data",
    note: "Logical JVM structures",
    ids: ["method-area", "runtime-constant-pool"],
  },
  {
    title: "Outside the Java heap",
    note: "Typical HotSpot native memory",
    ids: ["metaspace", "code-cache", "direct-memory"],
  },
];

export default function MemoryExplorer() {
  const [selected, setSelected] = useState<RegionId>("heap");
  const [model, setModel] = useState<Model>("spec");
  const region = regions[selected];

  const relatedLines = useMemo(
    () => codeLines.filter((line) => line.region === selected).map((line) => line.number),
    [selected],
  );

  return (
    <div className="memory-explorer">
      <div className="memory-toolbar">
        <div>
          <span className="memory-toolbar-label">Memory model</span>
          <div className="model-switch" role="group" aria-label="Choose a JVM memory model">
            <button
              type="button"
              className={model === "spec" ? "active" : ""}
              aria-pressed={model === "spec"}
              onClick={() => setModel("spec")}
            >
              JVM specification
            </button>
            <button
              type="button"
              className={model === "hotspot" ? "active" : ""}
              aria-pressed={model === "hotspot"}
              onClick={() => setModel("hotspot")}
            >
              HotSpot + G1
            </button>
          </div>
        </div>
        <p>
          {model === "spec"
            ? "The portable, logical runtime areas defined by the JVM specification."
            : "A concrete implementation view. GC regions and native structures vary by collector and JVM."}
        </p>
      </div>

      <div className="memory-workbench">
        <section className="code-panel" aria-labelledby="code-panel-title">
          <div className="panel-heading dark-panel-heading">
            <div>
              <span className="panel-kicker">Executable example</span>
              <h2 id="code-panel-title">JvmMemoryLab.java</h2>
            </div>
            <span>Java 17+</span>
          </div>
          <p className="code-instruction">Select a line to trace its primary memory location.</p>
          <ol className="java-code" aria-label="Interactive Java source code">
            {codeLines.map((line) => (
              <li key={line.number} className={line.region === selected ? "active" : ""}>
                <button
                  type="button"
                  onClick={() => setSelected(line.region)}
                  aria-label={`Line ${line.number}: ${line.text}. Show ${regions[line.region].title}`}
                >
                  <span aria-hidden="true">{line.number}</span>
                  <code>{line.text}</code>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="architecture-panel" aria-labelledby="architecture-title">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Live architecture map</span>
              <h2 id="architecture-title">Where the runtime state lives</h2>
            </div>
            <span>{model === "spec" ? "Logical model" : "Implementation example"}</span>
          </div>

          <div className="memory-map">
            {groups.map((group) => (
              <div className={`memory-group memory-group-${group.ids[0]}`} key={group.title}>
                <div className="memory-group-heading">
                  <strong>
                    {model === "hotspot" && group.title === "Class-level runtime data"
                      ? "HotSpot class data"
                      : group.title}
                  </strong>
                  <span>
                    {model === "hotspot" && group.title === "Java heap"
                      ? "G1 regions: Eden, Survivor, Old and Humongous"
                      : group.note}
                  </span>
                </div>
                <div className="memory-zone-grid">
                  {group.ids.map((id) => {
                    const item = regions[id];
                    const hidden = model === "spec" && id === "metaspace";
                    return (
                      <button
                        type="button"
                        key={id}
                        className={id === selected ? "memory-zone active" : "memory-zone"}
                        aria-pressed={id === selected}
                        onClick={() => setSelected(id)}
                        hidden={hidden}
                      >
                        <strong>{item.title}</strong>
                        <span>{item.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="memory-detail" aria-live="polite" aria-labelledby="memory-detail-title">
        <div className="memory-detail-heading">
          <div>
            <span className="panel-kicker">Selected location</span>
            <h2 id="memory-detail-title">{region.title}</h2>
          </div>
          <span>{region.scope}</span>
        </div>
        <div className="memory-detail-grid">
          <div>
            <strong>What lives here</strong>
            <p>{region.contains}</p>
          </div>
          <div>
            <strong>Lifetime and management</strong>
            <p>{region.lifetime}</p>
          </div>
          <div>
            <strong>Important nuance</strong>
            <p>{region.nuance}</p>
          </div>
        </div>
        <p className="related-lines">
          Code connection: {relatedLines.length > 0 ? relatedLines.map((line) => `line ${line}`).join(", ") : "runtime infrastructure rather than one source line"}
        </p>
      </section>

      <section className="memory-sequence" aria-labelledby="sequence-title">
        <div className="sequence-heading">
          <span className="panel-kicker">One execution path</span>
          <h2 id="sequence-title">What happens when execute() runs</h2>
        </div>
        <ol>
          <li><span>01</span><div><strong>Call and dispatch</strong><p>The caller creates a frame. supplyAsync places heap-resident task state into the executor.</p></div></li>
          <li><span>02</span><div><strong>Worker execution</strong><p>A pool thread creates its own execute-lambda frame and installs RequestContext in its ThreadLocalMap.</p></div></li>
          <li><span>03</span><div><strong>Allocation across boundaries</strong><p>Records and wrappers use the heap, while the direct buffer payload uses native memory.</p></div></li>
          <li><span>04</span><div><strong>Resolution and optimisation</strong><p>Runtime constants resolve symbols. Repeated hot execution may produce machine code in the JIT code cache.</p></div></li>
          <li><span>05</span><div><strong>Retention or collection</strong><p>The static map retains the Receipt. Temporary task objects become collectible after references disappear.</p></div></li>
        </ol>
      </section>
    </div>
  );
}
