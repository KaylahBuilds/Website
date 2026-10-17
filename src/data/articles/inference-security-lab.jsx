const post = {
  slug: 'designing-an-inference-security-lab',
  title: 'Designing an Inference Security Lab: Terraform, GitOps, Grafana, and Kubernetes Goat',
  date: '2026-10-17',
  tags: ['security', 'inference', 'kubernetes', 'terraform', 'gitops', 'observability'],
  excerpt:
    'A proposed learning lab that connects local model inference with evidence-based security investigations, isolated Kubernetes exercises, and measurable deployment practices.',
  body: (
    <>
      <p className="section-label">Architecture / proposed lab, not a deployment report</p>
      <p>
        Running a model is one milestone. Knowing why it is slow, whether its answers are
        supported, and how to deploy it safely is a different skill set. My next learning
        project brings those questions together: an inference platform that helps investigate
        security events from a deliberately isolated Kubernetes lab.
      </p>
      <p>
        This is the design and evaluation plan, not a claim that the platform is already
        deployed. There are no measured performance gains or detection results to report yet.
        The goal is to earn those results through repeatable experiments.
      </p>

      <h2>Start with inference, not an autonomous SOC</h2>
      <p>
        Philip Kiely's <em>Inference Engineering</em> provides the reading framework: latency
        and throughput in section 1.4, local inference in section 3.5, benchmarking in section
        4.5, optimization techniques in chapter 5, and production considerations in chapter 7.
        The practical question is not which model has the most impressive name. It is which
        configuration meets a defined quality requirement within a realistic resource budget.
      </p>
      <p>
        The first application will be a read-only investigation assistant. It will receive
        selected events, produce an evidence-linked summary, identify missing information,
        and suggest checks for a human analyst. It will not independently disable accounts,
        change firewall rules, or run cluster-administration commands.
      </p>

      <h2>What the model actually does</h2>
      <p>
        Consider a sequence of failed logins followed by a successful login. A collection
        service gathers relevant events, redacts sensitive fields, and supplies the evidence
        alongside an investigation checklist. The model does not automatically see the
        cluster, the dashboard, or every log on the machine.
      </p>
      <ol>
        <li><strong>Prepare:</strong> select relevant evidence and define the expected output schema.</li>
        <li><strong>Prefill:</strong> tokenize and process the prompt, building temporary attention data in a KV cache.</li>
        <li><strong>Decode:</strong> generate the response token by token using the trained model weights.</li>
        <li><strong>Validate:</strong> check the output structure, evidence references, and permitted recommendations.</li>
        <li><strong>Review:</strong> let an analyst decide what happens next.</li>
      </ol>
      <p>
        Inference normally does not update the model's weights. Supplying a playbook through
        retrieval-augmented generation gives it reference material for the current task;
        fine-tuning changes model parameters through a separate training process. Neither
        approach removes the need to verify its conclusions.
      </p>
      <blockquote>
        A convincing explanation is not proof. Every important claim should point back to evidence.
      </blockquote>

      <h2>One architecture, explicit ownership</h2>
      <div className="article-table-wrap" role="region" aria-label="Proposed platform responsibilities" tabIndex={0}>
        <table className="article-comparison">
          <caption>The deployment path and the investigation path have different owners.</caption>
          <thead><tr><th scope="col">Layer</th><th scope="col">Responsibility</th><th scope="col">Boundary</th></tr></thead>
          <tbody>
            <tr><th scope="row">Terraform</th><td>Machines, networks, storage, cluster infrastructure, and Argo CD bootstrap.</td><td>Separate state and lifecycle for the disposable lab.</td></tr>
            <tr><th scope="row">Argo CD</th><td>Deploy versioned application and monitoring configuration from Git.</td><td>No overlapping resource ownership with Terraform.</td></tr>
            <tr><th scope="row">Kubernetes</th><td>Schedule services, assign resources, and manage workload health.</td><td>It cannot create extra physical GPU memory.</td></tr>
            <tr><th scope="row">Inference service</th><td>Load a compatible model and serve requests through an API.</td><td>No unrestricted access to cluster administration.</td></tr>
            <tr><th scope="row">Investigation worker</th><td>Retrieve evidence, build prompts, and validate reports.</td><td>Evidence is untrusted data, not executable instructions.</td></tr>
            <tr><th scope="row">Observability</th><td>Collect metrics and logs, display dashboards, and route alerts.</td><td>Monitoring data needs retention limits and access controls.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Terraform will establish the foundation, then a separate bootstrap stage will connect
        to the ready cluster. Argo CD will own the application workloads. HashiCorp recommends
        separating cluster provisioning from Kubernetes-resource configuration; Argo CD can
        then reconcile its applications from Git. See the{' '}
        <a href="https://developer.hashicorp.com/terraform/tutorials/kubernetes/kubernetes-provider">Terraform Kubernetes guidance</a>
        {' '}and <a href="https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/">Argo CD declarative setup</a>.
      </p>
      <p>
        Git will contain pinned versions, configuration, policies, and synthetic tests—not
        model weights, credentials, or private investigation logs. Terraform state also needs
        protection: marking a value sensitive does not necessarily keep it out of state.
        Models belong in persistent storage with an explicit retention policy.
      </p>

      <h2>Where Unsloth, LM Studio, and the 5090 fit</h2>
      <p>
        LM Studio is the controlled experimentation environment; Bionic is useful for testing
        multi-step agent workflows. Unsloth is part of the model-serving and later customization
        workflow. A Kubernetes deployment will run a headless serving process, not a desktop
        interface. Runtime support must be checked for the exact model and quantization.
      </p>
      <p>
        The local baseline will be a manageable Qwen model, starting with Qwen3-8B Q4_K_M and
        comparing it with Q8_0. My RTX 5090 has 32 GB of VRAM. That is a useful inference lab,
        but disk capacity is not working memory: downloading a huge model does not make it
        practical to run. Full GLM-5.3 is a larger-server candidate, not the initial local
        baseline. Unsloth's current guide lists approximately 223 GB total memory even for
        its 1-bit variant. Requirements must be rechecked before provisioning hardware.
        {' '}<a href="https://huggingface.co/Qwen/Qwen3-8B-GGUF">Qwen model card</a>
        {' · '}<a href="https://unsloth.ai/docs/models/glm-5.3">GLM-5.3 sizing guide</a>
        {' · '}<a href="https://unsloth.ai/docs/basics/api">Unsloth API documentation</a>
      </p>
      <p>
        The first Kubernetes exercise can run only the API wrapper while inference remains
        outside the cluster. Moving the model into a GPU pod comes after proving container
        GPU access. For a single-GPU deployment, one replica and stop-before-start updates
        avoid requiring a second GPU allocation, at the cost of brief downtime.
      </p>

      <h2>Grafana makes the tradeoffs visible</h2>
      <p>
        Grafana will be the investigation and performance dashboard, not the database or
        detection engine. Prometheus will store metrics. Alloy will collect and forward
        telemetry, with Loki storing logs. Tempo can follow later when distributed tracing
        helps explain where request time is spent. The{' '}
        <a href="https://grafana.com/docs/grafana/latest/fundamentals/">Grafana documentation</a>
        {' '}distinguishes these roles.
      </p>
      <ul>
        <li><strong>Inference:</strong> time to first token, total report time, P50/P95 latency, queue depth, errors, and memory use.</li>
        <li><strong>Platform:</strong> unready pods, restarts, out-of-memory events, disk pressure, and deployment status.</li>
        <li><strong>Security:</strong> runtime alerts, relevant audit events, policy violations, and links to supporting evidence.</li>
      </ul>
      <p>
        These signals require instrumentation and functioning collectors. GPU utilization
        alone cannot reveal time to first token. Kubernetes audit logging must be configured;
        it is not the same as collecting pod logs. GPU exporter support also needs validation
        on the actual GeForce and Windows or Linux environment.
      </p>
      <p>
        I will start with short retention and bounded storage, rather than deploy every
        observability component at once. Raw prompts and unique request IDs do not belong
        in metric labels: they create privacy and high-cardinality problems. Sanitized logs
        and traces can carry correlation IDs under appropriate access controls.
      </p>

      <h2>Kubernetes Goat: an isolated source of learning evidence</h2>
      <p>
        <a href="https://github.com/madhuakula/kubernetes-goat">Kubernetes Goat by Madhu Akula</a>
        {' '}is intentionally vulnerable. Its{' '}
        <a href="https://madhuakula.com/kubernetes-goat/docs/scenarios/">scenario catalog</a>
        {' '}includes RBAC misconfiguration, resource exhaustion, exposed services, network
        boundaries, and exercises involving Falco, Tetragon, and Kyverno. Those scenarios
        offer controlled inputs for detection and investigation practice—not a production
        security certification or a complete control checklist.
      </p>
      <p>
        The lab will live in a disposable Linux VM or separate isolated machine. A namespace
        is not an adequate boundary for exercises that include privileged containers and
        host escape. There will be no personal-folder mounts, production secrets, shared
        administrator credentials, or public exposure. Initial evidence transfer will use
        sanitized exports; any later telemetry connection will have narrowly restricted access.
      </p>
      <p>
        The first exercise will be a bounded resource-limit scenario: observe resource
        pressure, confirm an alert, collect the evidence, ask the assistant for an assessment,
        apply a reviewed fix, and retest. Argo CD must not silently restore an intentionally
        vulnerable configuration during hardening tests. Baseline and hardened configurations
        need explicit versioning and deliberate synchronization.
      </p>

      <h2>Evaluate the analyst, not just the token counter</h2>
      <p>
        A fast incorrect report is not an optimization. I will use labeled benign and
        suspicious cases, plus a held-out set that is never used for fine-tuning. Each run
        will record the model revision, quantization, context settings, input/output lengths,
        and warm-versus-cold conditions. One variable changes at a time.
      </p>
      <ul>
        <li>Does the report cite real events and avoid unsupported claims?</li>
        <li>Does it distinguish suspicious behavior from confirmed compromise?</li>
        <li>How many malicious cases are missed, and how many benign cases are escalated?</li>
        <li>Does it reject instructions embedded inside untrusted evidence?</li>
        <li>Does it remain useful when logs are incomplete or the model times out?</li>
      </ul>
      <p>
        Logs and retrieved documents may contain attacker-controlled text. The assistant
        should treat that material as data, use bounded read-only tools, and return an
        explicit failure or uncertainty state when appropriate. Schema validation is necessary,
        but it does not prove an assessment is correct. Human approval remains the boundary
        before remediation. See <a href="https://community.owasp.org/attacks/PromptInjection">OWASP's prompt-injection overview</a>.
      </p>

      <h2>The first milestone</h2>
      <p>
        The initial deliverable is deliberately small: one repeatable lab event, one useful
        dashboard, one evidence-linked report, and one reviewed configuration change that
        can be deployed and reverted. The implementation sequence is baseline inference,
        instrumentation, GitOps deployment, isolated Goat evidence, and then evaluation.
      </p>
      <p>
        That is the bridge between running a local model and practicing inference engineering.
        The platform is successful when its conclusions can be checked, its behavior can be
        measured, and its changes can be reproduced—not when it merely produces fluent text.
      </p>
    </>
  ),
}

export default post
