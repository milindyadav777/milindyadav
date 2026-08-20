import type { Metadata } from "next";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import MemoryExplorer from "./MemoryExplorer";

export const metadata: Metadata = {
  title: "Java Memory Architecture | milindyadav",
  description:
    "An interactive explanation of JVM stacks, heap objects, String interning, wrapper caches, runtime constant pools, Metaspace, direct memory and JIT code.",
};

export default function JavaMemoryPage() {
  return (
    <main>
      <SiteHeader activePage="java-memory" />

      <section className="memory-hero" id="top">
        <p className="kicker">Java runtime field guide</p>
        <h1>Follow Java code through <em>stack, heap and native memory.</em></h1>
        <p>
          This page connects an executable Java 17 example to the JVM specification
          and to a typical HotSpot implementation. Select code lines or memory regions
          to see what is stored, who owns it and when it can disappear.
        </p>
      </section>

      <section className="memory-model-intro" aria-labelledby="memory-model-intro-title">
        <div className="memory-model-intro-heading">
          <p className="section-index">Two lenses, one running program</p>
          <h2 id="memory-model-intro-title">
            The JVM specification defines the contract. HotSpot implements it. G1 manages its heap.
          </h2>
          <p>
            These are not two competing kinds of Java. They answer different questions about the
            same execution. Start with the specification to understand what every compliant JVM
            must provide, then move to HotSpot and G1 when implementation details affect real
            behaviour, diagnostics or performance.
          </p>
        </div>

        <ol className="memory-model-relationship" aria-label="Relationship between Java, the JVM specification, HotSpot and G1">
          <li>
            <span>01</span>
            <div><strong>Java program</strong><small>Bytecode and application data</small></div>
          </li>
          <li>
            <span>02</span>
            <div><strong>JVM specification</strong><small>Portable rules and logical runtime areas</small></div>
          </li>
          <li>
            <span>03</span>
            <div><strong>HotSpot JVM</strong><small>A concrete implementation of those rules</small></div>
          </li>
          <li>
            <span>04</span>
            <div><strong>G1 garbage collector</strong><small>One HotSpot collector that manages the Java heap</small></div>
          </li>
        </ol>

        <div className="memory-model-table-wrap">
          <table className="memory-model-table">
            <thead>
              <tr>
                <th scope="col">View</th>
                <th scope="col">What it is</th>
                <th scope="col">What it explains</th>
                <th scope="col">Use it when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">JVM specification</th>
                <td>The implementation-independent contract every compliant JVM follows.</td>
                <td>Logical areas such as JVM stacks, heap, method area and runtime constant pools.</td>
                <td>Learning fundamentals, reasoning portably, reading bytecode rules or discussing behaviour across JVM implementations.</td>
              </tr>
              <tr>
                <th scope="row">HotSpot + G1</th>
                <td>HotSpot is a JVM implementation. G1 is one garbage collector available inside HotSpot.</td>
                <td>Metaspace, JIT code cache, object layout, native memory and G1 heap regions such as Eden, Survivor, Old and Humongous.</td>
                <td>Operating a HotSpot process, reading GC logs, choosing JVM flags, investigating pauses, native memory or out-of-memory failures.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="memory-model-rule">
          <strong>Practical rule:</strong> use the specification for what Java guarantees. Use the
          HotSpot + G1 view for how one widely used JVM delivers those guarantees. Other JVMs or
          collectors can implement the same contract differently.
        </p>
      </section>

      <MemoryExplorer />

      <section className="memory-caveat">
        <p className="section-index">Specification before folklore</p>
        <h2>Stack versus heap is the beginning, not the complete JVM memory model.</h2>
        <p>
          The JVM specification defines logical areas and deliberately leaves physical
          layout choices to implementations. HotSpot, OpenJ9 and different garbage
          collectors can realise those areas differently while preserving Java behaviour.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
