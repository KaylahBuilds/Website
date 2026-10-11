const post = {
  slug: 'falco-runtime-security-tiers',
  title: 'Falco Runtime Security: Three Tiers from Visibility to Human Response',
  date: '2026-10-10',
  tags: ['security', 'kubernetes', 'runtime'],
  excerpt:
    'Learn what Falco can observe, tune exceptions without losing the signal, and turn runtime alerts into careful human decisions with a three-tier companion lab.',
  body: (
    <>
      <p className="section-label">Runtime security / useful signals, careful decisions</p>
      <p>
        An image can pass a build check and still behave unexpectedly after deployment. A web
        process might start a shell, access an unusual file, or launch a tool outside its normal
        job. Runtime detection asks what actually happened after the workload started. Falco
        evaluates event streams against rules and emits alerts when conditions match. Its{' '}
        <a href="https://falco.org/docs/concepts/rules/">rule model</a> combines conditions,
        output fields, priorities, reusable macros, and lists.
      </p>
      <p>
        An alert is evidence to investigate, not proof of compromise. Falco detection also does
        not, by itself, block the observed operation. A separate response system can act on an
        alert, but that introduces its own permissions and failure modes. Start by proving the
        signal, then improving its relevance, then deciding how people should respond.
      </p>
      <p>
        These are our adoption tiers, not official Falco maturity levels or certifications. The{' '}
        <a href="https://github.com/KaylahBuilds/falco-tiered-lab">Falco Tiered Lab</a> pairs
        native rule files with a deliberately limited offline triage exercise and an optional
        disposable-cluster walkthrough. It does not claim a production deployment or measured
        detection coverage.
      </p>

      <div
        className="article-table-wrap"
        role="region"
        aria-label="Falco adoption tiers"
        tabIndex={0}
      >
        <table className="article-comparison">
          <caption>Progress from an observable event to an accountable response.</caption>
          <thead>
            <tr>
              <th scope="col">Tier</th>
              <th scope="col">Question</th>
              <th scope="col">Evidence to collect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1 / Visibility</th>
              <td>Can the intended event reach the intended rule?</td>
              <td>Rule validation, controlled event, matching alert fields</td>
            </tr>
            <tr>
              <th scope="row">2 / Tuning</th>
              <td>Can expected behavior be excluded precisely?</td>
              <td>Positive, negative, and exception-boundary checks</td>
            </tr>
            <tr>
              <th scope="row">3 / Response</th>
              <td>Can someone make a safe, informed decision?</td>
              <td>Bounded triage record, owner, runbook, recorded decision</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Tier 1: Establish visibility with a harmless event</h2>
      <p>
        The lab’s{' '}
        <a href="https://github.com/KaylahBuilds/falco-tiered-lab/tree/main/tier-1-visibility">
          first tier
        </a>{' '}
        scopes process-start visibility to a demo workload. A short-lived command such as{' '}
        <code>/bin/true</code> gives the sensor something predictable to observe without reading
        secrets or damaging files. Begin with the rule’s question: which event type, process,
        container, and workload should match? Then identify what would make a similar event
        fall outside that scope.
      </p>
      <p>
        Keep the rule’s description and output useful to another person. Include enough context
        to locate the workload and understand the event, while avoiding unnecessary sensitive
        data. Falco’s{' '}
        <a href="https://falco.org/docs/concepts/rules/custom-ruleset/">custom-rules guide</a>{' '}
        explains conditions, output definitions, and the tradeoff between rules that are too
        broad and rules that miss relevant behavior. Validate the rule using the compatible
        Falco version before attempting a sensor exercise.
      </p>
      <p>
        A successful validation only establishes that the engine accepts the rules. It cannot
        demonstrate that a node exposes the required events, that container metadata arrives,
        or that alerts reach your destination. In a disposable Linux cluster, record the rule
        revision, sensor configuration, node, test time, and resulting alert. If nothing appears,
        investigate collection, metadata, rule scope, and output delivery separately.
      </p>

      <h2>Tier 2: Tune behavior without hiding nearby activity</h2>
      <p>
        Shell execution is a useful learning example because it can be both legitimate and
        suspicious. A maintenance workflow may need a shell; an application process unexpectedly
        spawning one deserves attention. The{' '}
        <a href="https://github.com/KaylahBuilds/falco-tiered-lab/tree/main/tier-2-tuning">
          second tier
        </a>{' '}
        adds a narrow exception for an exact demo maintenance context. It teaches why excluding
        every process named <code>sh</code> would throw away the distinction you wanted to detect.
      </p>
      <p>
        Falco supports{' '}
        <a href="https://falco.org/docs/concepts/rules/exceptions/">exceptions across multiple fields</a>,
        so an exception can bind several attributes together. Treat each allowed combination
        as a reviewed decision. Give it an owner, a reason, a review date, and a test showing
        the intended behavior is excluded. Those maintenance practices belong to your workflow;
        an exception’s name does not automatically make it temporary or safe.
      </p>
      <p>
        Test the boundary by changing one attribute at a time. The approved maintenance shell
        should be excluded, while a shell in the ordinary demo workload should still alert.
        Remember that process names and workload labels are context, not cryptographic identity.
        Anyone able to reproduce an excluded context may benefit from the same blind spot.
        Keep exception permissions and workload creation permissions in the review.
      </p>
      <p>
        Fewer alerts are not sufficient evidence of improvement. Compare useful alerts,
        expected exclusions, unexplained misses, and event loss. Falco documents{' '}
        <a href="https://falco.org/docs/troubleshooting/dropping/">dropped syscall events</a>{' '}
        and the counters used to investigate them. A quiet dashboard could mean normal
        behavior, an overly broad exception, missing telemetry, or a broken delivery path.
      </p>

      <h2>Tier 3: Make response reviewable</h2>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/falco-tiered-lab/tree/main/tier-3-response">
          third tier
        </a>{' '}
        consumes synthetic Falco-shaped JSON to practice triage. It keeps selected fields,
        handles duplicate input, and directs unfamiliar or incomplete alerts to manual review.
        It does not execute shell commands, contact a cluster, or contain a workload. These
        fixtures exercise the consumer’s behavior; they are not a replay through Falco’s
        event engine.
      </p>
      <p>
        Build a runbook around questions a responder can answer: is this the expected workload,
        does the timestamp fit an approved change, what supporting evidence exists, and who
        owns the next decision? Preserve the event and record the decision before taking a
        disruptive action. If containment becomes necessary, use separately authorized access
        and a procedure appropriate to the affected service.
      </p>
      <p>
        Falco’s{' '}
        <a href="https://falco.org/docs/concepts/outputs/channels/">output channels</a> support
        several delivery patterns, including program output. Treat every event field as
        untrusted data: a process command line can contain attacker-controlled text. Do not
        interpolate that text into a shell command. Review delivery errors, buffering,
        destination access, retention, and alert volume before connecting an operational sink.
      </p>

      <h2>The sensor and its data need protection too</h2>
      <p>
        Kernel observation requires sensitive host access. Falco’s{' '}
        <a href="https://falco.org/docs/setup/container/">container deployment guidance</a>{' '}
        distinguishes driver-specific privilege requirements and recommends the least-privileged
        supported configuration. Review host mounts, capabilities, runtime sockets, and the
        supported kernel before installation. A narrowly scoped detection rule does not narrow
        the sensor’s host privileges. Command lines and paths may expose secrets or personal
        data, so choose fields and retention deliberately.
      </p>

      <h2>A validation checklist you can reuse</h2>
      <ul>
        <li>Run the repository checks and distinguish native rule validation from offline triage tests.</li>
        <li>In an authorized disposable cluster, generate the harmless event and inspect its actual alert.</li>
        <li>Verify both the intended exception and a nearby case that must still alert.</li>
        <li>Check sensor health, dropped events, metadata, and delivery when interpreting silence.</li>
        <li>Feed duplicate, incomplete, and unfamiliar records into triage; verify a human owns uncertain decisions.</li>
      </ul>
      <p>
        Use{' '}
        <a href="/#/blog/kyverno-policy-security-tiers">Kyverno admission guardrails</a> to
        constrain what enters a cluster, and{' '}
        <a href="/#/blog/software-supply-chain-security-tiers">supply-chain verification</a> to
        assess how an artifact was produced. Falco adds observations about execution. Each
        answers a different question, and each needs evidence that its own boundary works.
      </p>
    </>
  ),
};

export default post;
