export const dgxSparkGitOpsPost = {
  slug: 'dgx-spark-gitops-k3s-argocd',
  title: 'Build a GitOps Platform on DGX Spark Before Your First Model',
  date: '2026-10-08',
  tags: ['kubernetes', 'gitops', 'AI infrastructure', 'observability'],
  excerpt:
    'Start a DGX Spark with a repeatable deployment workflow. k3s and Argo CD give your AI workloads versioned configuration, explicit GPU access, and a way to understand what changed between experiments.',
  body: (
    <>
      <p>
        The first thing I would set up on a DGX Spark is a repeatable way to deploy and manage AI workloads.
        Before choosing a model, I want to know where its configuration lives, how it gets deployed, and how
        I will reproduce the environment after a week of experiments. For a machine that will host persistent
        AI services, I would start with <strong>k3s and Argo CD</strong>.
      </p>
      <p>
        Getting a model to answer a prompt is a useful milestone. Soon, though, there are serving images,
        model revisions, storage volumes, API endpoints, and configuration changes to keep track of. A
        deployment platform gives those experiments a consistent home. Each new workload enters through
        the same process, with a history I can inspect and a declared state I can restore.
      </p>
      <p>
        This is an operating choice for a platform or DevSecOps lab. Kubernetes is not a prerequisite for
        DGX Spark inference. A direct container workflow is reasonable for a quick model test; GitOps earns
        its place when the environment needs to survive repeated changes.
      </p>

      <h2>Start with the deployment contract</h2>
      <p>
        A useful AI workload definition should answer a few concrete questions: which serving image runs,
        which model revision it loads, how much CPU and memory it requests, where its data lives, and how
        clients reach it. Those answers belong in version control alongside the configuration that creates
        the service.
      </p>
      <p>
        Declarative management means describing the desired result. For example: run this version of a
        model server, give its Pod one GPU, mount a model-storage volume, and expose an internal endpoint.
        Kubernetes works toward that state. Argo CD compares the running resources with their declared
        configuration and provides a synchronization workflow.
      </p>
      <p>
        The practical benefit appears on the second experiment. If a new serving image fails to start, the
        previous image and configuration are still recorded. If a memory setting changes, the diff explains
        the change. If the machine needs rebuilding, the repository provides the deployment definitions.
        Model quality still needs its own evaluation; deployment history makes the environment easier to
        reason about while doing it.
      </p>

      <h2>Give each layer a clear job</h2>
      <p>
        I would divide responsibility between the host and the workloads. DGX OS manages the hardware
        foundation. k3s supplies a lightweight Kubernetes distribution. The NVIDIA GPU Operator manages
        the selected Kubernetes GPU components. Argo CD reconciles the application configuration.
      </p>
      <ul>
        <li><strong>DGX OS:</strong> the supported operating system, firmware, driver, and host container tooling.</li>
        <li><strong>k3s:</strong> workload scheduling, container execution, cluster networking, and storage integration.</li>
        <li><strong>GPU Operator:</strong> device discovery, the GPU device plugin, and the GPU integration components you enable.</li>
        <li><strong>Argo CD:</strong> desired-state comparison, deployment synchronization, and application visibility.</li>
      </ul>
      <p>
        The app-of-apps pattern makes this manageable: one root Argo Application declares the child
        Applications. GPU integration, workload defaults, model services, and monitoring can then have
        their own configurations and lifecycle. The example below shows that structure, including
        separate model, gateway, monitoring, and networking Applications.
      </p>
      <figure className="article-figure">
        <a
          href={`${import.meta.env.BASE_URL}images/dgx-spark-argocd-platform.png`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the Argo CD application overview at full size"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/dgx-spark-argocd-platform.png`}
            alt="Argo CD overview showing seven Healthy and Synced Applications, including app-of-apps, model workloads, GPU Operator, LiteLLM, and monitoring."
            width="2048"
            height="1051"
            loading="lazy"
          />
        </a>
        <figcaption>
          Separate Applications make the platform easier to inspect. Open the image to read the full view.
          The visible statuses describe managed resources, rather than an inference benchmark.
        </figcaption>
      </figure>

      <h2>Build the GPU path deliberately</h2>
      <p>
        Spark already includes NVIDIA hardware-enablement software. I would preserve that host stack
        and configure Kubernetes around it. NVIDIA documents a GPU Operator installation path for
        systems with preinstalled drivers and container tooling: disable the Operator&apos;s driver and
        toolkit installation, and configure the NVIDIA runtime as the default.
      </p>
      <p>
        For the documented legacy-runtime path, the relevant settings look like this. CDI is explicitly
        disabled here; a CDI-based setup has its own configuration requirements. Check the current
        platform matrix and runtime documentation before selecting versions.
      </p>
      <p>k3s configuration in <code>/etc/rancher/k3s/config.yaml</code>:</p>
      <pre><code>{`default-runtime: nvidia`}</code></pre>
      <p>GPU Operator Helm values in <code>gpu-operator-values.yaml</code>:</p>
      <pre><code>{`driver:
  enabled: false
toolkit:
  enabled: false
cdi:
  enabled: false
dcgmExporter:
  enabled: false`}</code></pre>
      <p>
        The exporter is disabled here because GB10 telemetry needs separate support verification, as
        discussed below.
      </p>
      <p>
        k3s detects supported alternative runtimes from its service PATH when it starts. A runtime added
        later needs to be discovered on restart. For GPU workloads, I would also declare
        <code>runtimeClassName: nvidia</code> and request <code>nvidia.com/gpu: 1</code> explicitly, so
        the workload definition records its dependency.
      </p>
      <p>
        Container architecture matters too. An image must support ARM64, and its CUDA or framework build
        must support GB10&apos;s GPU architecture. An image that pulls successfully can still fail when it
        tries to execute a kernel. Keep image compatibility and hardware validation in the deployment checklist.
      </p>

      <h2>Make changes through Git</h2>
      <p>
        Bootstrap the cluster and Argo CD once, establish repository access, and apply the root Application.
        From that point, use a small, consistent change path: edit the declared configuration, review the
        diff, commit it, and let Argo synchronize it. Pin chart versions, serving-image digests where
        practical, and model revisions so an update has an identifiable target.
      </p>
      <p>
        Argo&apos;s synchronization settings deserve an explicit decision. Auto-sync deploys declared changes.
        Self-heal can correct live configuration drift. Pruning removes resources that are no longer
        declared. These are separate controls; installing Argo does not automatically enable all three.
        For an initial platform, I would enable auto-sync and self-heal while reviewing deletions manually.
      </p>
      <pre><code>{`syncPolicy:
  automated:
    enabled: true
    selfHeal: true
    prune: false`}</code></pre>
      <p>
        The GPU Operator screenshot illustrates the distinction: the Application is Healthy and Synced,
        while the interface also says auto-sync is disabled. The deployed state currently matches its
        target; future synchronization still needs a trigger. Green status alone does not establish the
        automation policy or prove that a model can serve requests.
      </p>
      <figure className="article-figure">
        <a
          href={`${import.meta.env.BASE_URL}images/dgx-spark-gpu-operator.png`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the GPU Operator resource view at full size"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/dgx-spark-gpu-operator.png`}
            alt="Healthy and Synced GPU Operator Application in Argo CD, with auto-sync disabled and device-plugin, discovery, validator, and exporter resources visible."
            width="1917"
            height="965"
            loading="lazy"
          />
        </a>
        <figcaption>
          Healthy, Synced, and automatic synchronization answer different operational questions.
          Exporter presence also needs to be checked against actual hardware support.
        </figcaption>
      </figure>

      <h2>Validate before loading a model</h2>
      <p>
        I would validate the platform in stages. First, confirm the host can see the GPU. Then check the
        NVIDIA RuntimeClass and the GPU resource advertised to Kubernetes. Next, run a small Job that
        requests the GPU and executes <code>nvidia-smi</code> inside its container. That establishes
        scheduling and device visibility, not CUDA computation.
      </p>
      <p>
        A compatible CUDA computation is the next check. A real request to the model-serving endpoint
        follows it. Keeping these stages separate makes a failure easier to locate: host, runtime,
        scheduling, framework compatibility, or serving configuration.
      </p>
      <p>
        On a single GPU, rollout behavior also needs a choice. For a service requesting the whole GPU,
        one replica with a <code>Recreate</code> deployment strategy avoids demanding a second GPU during
        an update. It introduces an interruption while the service is replaced. Adding replicas does not
        create GPU capacity, and an exclusive GPU allocation does not partition its memory.
      </p>
      <p>
        Keep completed validation Jobs if Argo is managing them with self-heal. A TTL that deletes a Job
        can cause it to be recreated. For a new test configuration, give the Job a new name and review
        cleanup of the old one; its Pod template is immutable.
      </p>

      <h2>Add visibility and a model gateway</h2>
      <p>
        Once serving works, I want visibility into host memory pressure, Pod health, disk use, request
        latency, queue depth, and errors. Spark&apos;s 128 GB is unified memory shared by the CPU and GPU.
        Budget model weights, KV cache, host processes, and platform services together rather than
        treating that capacity as dedicated GPU VRAM.
      </p>
      <p>
        Monitoring needs hardware-specific care. DCGM Exporter is common on supported NVIDIA GPU
        platforms, but a running exporter does not guarantee supported or accurate Spark metrics. In
        March 2026, NVIDIA&apos;s support forum stated that DCGM was unsupported on GB10. Check current
        support before relying on it; start with host and serving metrics, and validate any GPU telemetry
        you add. If using a Prometheus operator stack, install its CRDs before resources such as ServiceMonitor.
      </p>
      <p>
        LiteLLM becomes useful when several clients need a consistent gateway to serving endpoints.
        Model aliases, routing, and access controls can live in a separate declared service. The serving
        engine still performs inference. LiteLLM&apos;s documented virtual-key workflow requires PostgreSQL,
        so its database, credentials, and backup plan become part of the platform too.
      </p>
      <p>
        The Network Operator in the example is another optional layer. Its accelerated-networking
        components matter when the workload needs RDMA or specialized network integration. I would add
        it for that requirement, rather than making it a dependency of every single-node HTTP model service.
      </p>

      <h2>Prove the platform can be reproduced</h2>
      <p>
        The repository is only part of recovery. Model files, datasets, databases, and secrets require
        their own storage and protection. A persistent volume survives ordinary Pod replacement; it is
        not a backup. Retained local storage still depends on the node and its disk. Reverting a Git
        commit restores declared configuration, not a database migration or lost data.
      </p>
      <p>
        Before relying on the platform, I would redeploy a service from its definitions, change a setting
        through Git, revert it, verify the configured drift behavior, and restore a small dataset from
        backup. Those exercises test whether the workflow actually supports the next upgrade and rebuild.
      </p>
      <p>
        k3s and Argo CD add operating work, and a single-node cluster still has a single point of failure.
        For persistent services and a DevSecOps lab, I consider that tradeoff worthwhile: every model
        experiment can arrive with a defined image, model revision, storage plan, resource budget, and
        deployment path. That is the foundation I would build before the environment becomes harder to maintain.
      </p>

      <h2>References</h2>
      <ul>
        <li><a href="https://docs.k3s.io/">k3s overview</a> and <a href="https://docs.k3s.io/advanced">NVIDIA runtime configuration</a></li>
        <li><a href="https://argo-cd.readthedocs.io/en/stable/">Argo CD overview</a> and <a href="https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/">auto-sync, self-heal, and pruning</a></li>
        <li><a href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/platform-support.html">GPU Operator platform support</a>, <a href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html">preinstalled-driver and toolkit setup</a>, and <a href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/cdi.html">CDI configuration</a></li>
        <li><a href="https://docs.nvidia.com/dgx/dgx-spark-porting-guide/porting/software-requirements.html">DGX Spark software stack</a> and <a href="https://docs.nvidia.com/dgx/dgx-spark-porting-guide/optimization.html">unified-memory considerations</a></li>
        <li><a href="https://forums.developer.nvidia.com/t/dcgm-exporter-missing-process-level-attribution-for-gpu-time-slicing-on-blackwell-gb10/363037">NVIDIA support discussion of DCGM on GB10</a></li>
        <li><a href="https://docs.litellm.ai/docs/">LiteLLM gateway documentation</a> and <a href="https://docs.litellm.ai/docs/proxy/virtual_keys">virtual-key requirements</a></li>
        <li><a href="https://docs.nvidia.com/networking/display/kubernetes2670/overview.html">NVIDIA Network Operator overview</a></li>
      </ul>
    </>
  ),
}
