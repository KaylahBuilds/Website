const post = {
  slug: 'runreveal-detection-as-code',
  title: 'RunReveal Detection as Code: Terraform Ingestion and a Safer CI/CD Pipeline',
  date: '2026-10-10',
  tags: ['security', 'aws', 'terraform'],
  excerpt:
    'Build a reusable AWS WAF and ALB ingestion module, then review, test, and promote RunReveal detections without giving pull requests production credentials.',
  body: (
    <>
      <p className="section-label">Detection engineering / from log delivery to reviewed change</p>
      <p>
        A detection has two dependencies that deserve equal attention: the events it can see
        and the process allowed to change its logic. A well-reviewed rule cannot find a request
        that never reached the platform. A reliable log pipeline cannot rescue a rule that
        quietly stopped matching after an edit. Treat both as engineering systems with owners,
        tests, and explicit limits.
      </p>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/runreveal-detection-as-code">
          RunReveal Detection-as-Code lab
        </a>{' '}
        connects these concerns through two examples. The first provisions AWS-side ingestion
        infrastructure using Terraform. The second puts detection changes through a reviewable
        CI/CD process. The examples are a starting point for an authorized staging environment,
        not a claim that a production integration has already been deployed.
      </p>

      <div
        className="article-table-wrap"
        role="region"
        aria-label="RunReveal lab examples and their boundaries"
        tabIndex={0}
      >
        <table className="article-comparison">
          <caption>Two examples, two different kinds of authority.</caption>
          <thead>
            <tr>
              <th scope="col">Example</th>
              <th scope="col">What it manages</th>
              <th scope="col">What remains a separate decision</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1 / Terraform ingestion</th>
              <td>Log buckets, notifications, queues, and reader-role permissions</td>
              <td>Existing workload logging, RunReveal source registration, and cloud apply</td>
            </tr>
            <tr>
              <th scope="row">2 / Detection CI/CD</th>
              <td>Versioned detections, fixtures, validation, and a promotion template</td>
              <td>Workspace credentials, deployment approval, and live signal validation</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Example 1: Reuse the ingestion boundary, not a copy of production</h2>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/runreveal-detection-as-code/tree/main/modules/runreveal-aws-logs">
          reusable Terraform module
        </a>{' '}
        creates separate paths for WAF and ALB: each source gets a new S3 bucket, an SQS queue,
        and a reader role. S3 object notifications tell the queue which objects are available;
        RunReveal reads the queue and retrieves those objects. This follows RunReveal’s{' '}
        <a href="https://docs.runreveal.com/sources/object-storage/external-s3">
          custom-SQS ingestion method
        </a>.
      </p>
      <p>
        Separate paths make failures easier to locate. If WAF events arrive but ALB events do
        not, inspect the ALB delivery path without changing the WAF queue or permissions.
        They also make ownership clear: the module owns the new buckets and their notification
        configuration, not an existing shared bucket containing unrelated integrations.
      </p>
      <p>
        The{' '}
        <a href="https://github.com/KaylahBuilds/runreveal-detection-as-code/tree/main/examples/aws-waf-alb">
          example configuration
        </a>{' '}
        targets a single account and Region in commercial AWS. Connect it to an existing ALB
        through the stack that already owns that load balancer. WAF logging is an explicit
        opt-in for an existing regional web ACL. This example does not create a public
        application, recreate your ALB, or configure CloudFront, cross-account collection,
        or Outposts.
      </p>
      <p>
        Terraform manages the AWS resources here; source registration in RunReveal is a
        documented handoff. Use the module’s queue URL, Region, role ARN, and corresponding
        external ID when configuring each source. The example does not present an unverified
        RunReveal Terraform provider as a working integration. Keep that boundary visible in
        the deployment plan: an AWS apply alone does not finish onboarding.
      </p>

      <h3>Separate delivery permissions from reading permissions</h3>
      <p>
        AWS log-delivery services need permission to write to the intended destination.
        RunReveal needs permission to read the appropriate objects and consume its queue.
        Those are different principals doing different jobs. A detection publisher is a
        third identity; publishing a rule should not require AWS infrastructure administration.
      </p>
      <p>
        The reader-role trust policy requires the expected external ID, while the permissions
        policy limits accessible resources. Neither replaces the other. RunReveal’s{' '}
        <a href="https://docs.runreveal.com/sources/object-storage/external-s3">
          role-based access guidance
        </a>{' '}
        explains this arrangement. An external ID helps address confused-deputy risk; it is
        not a substitute for a narrowly scoped role or a secret API key. Never commit API
        keys, AWS credentials, Terraform state, saved plans, or real customer logs.
      </p>

      <h3>Budget for delay, storage, and sensitive fields</h3>
      <p>
        This is an object-storage ingestion design, not an inline request blocker. AWS documents
        five-minute publication intervals for{' '}
        <a href="https://docs.aws.amazon.com/waf/latest/developerguide/logging-s3.html">
          WAF S3 logs
        </a>{' '}
        and traditional{' '}
        <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html">
          ALB access logs
        </a>.
        Add queueing, ingestion, and detection scheduling when estimating time to alert. ALB
        log delivery is best-effort and eventually consistent; a missing record is not proof
        that a request never occurred.
      </p>
      <p>
        Decide retention and cost limits before applying. Include logging, S3 storage and
        requests, SQS activity, RunReveal ingestion and retention, and the operational cost
        of noisy detections. At first startup, prove the path with new controlled requests;
        do not assume historical objects were automatically backfilled because a queue exists.
        Track queue age, recent ingested events, and source failures as well as alert counts.
      </p>
      <p>
        URLs, headers, and client addresses can carry sensitive data. Redact unnecessary
        fields before collecting them, and verify the result in the actual destination.
        AWS notes that WAF{' '}
        <a href="https://docs.aws.amazon.com/waf/latest/developerguide/logging.html">
          logging redaction does not also configure request sampling or Security Lake
        </a>.
        A privacy setting on one output should not be mistaken for a policy covering every copy.
      </p>

      <h2>Example 2: Make detection changes reviewable before making them powerful</h2>
      <p>
        RunReveal’s{' '}
        <a href="https://blog.runreveal.com/runreveal-detection-cicd-guide/">
          detection CI/CD guide
        </a>{' '}
        provides the starting sequence: keep detections in source control, validate proposed
        changes, then synchronize approved definitions. The lab adapts that sequence with a
        clear trust boundary. Pull-request validation must not need production credentials.
        Workspace synchronization belongs in a separate, explicitly enabled deployment path.
      </p>
      <p>
        Keep each detection next to its synthetic fixtures and review notes. Describe what
        must match, what must not match, and what the rule cannot establish. A WAF block tells
        you which policy action was recorded; it does not prove malicious intent. An ALB
        response can support an investigation, but a response status alone does not prove
        that an application was compromised. Never turn these examples into automatic
        IP bans without separately designing and authorizing a response system.
      </p>
      <ul>
        <li>
          The{' '}
          <a href="https://github.com/KaylahBuilds/runreveal-detection-as-code/blob/main/detections/sigma/aws-waf-blocked-admin-request.yaml">
            streaming WAF example
          </a>{' '}
          looks for <code>action: BLOCK</code> with a raw <code>httpRequest.uri</code> of{' '}
          <code>/admin/login</code> or <code>/wp-login.php</code>. Its synthetic fixtures
          exercise a small, understandable condition rather than attempting an attack.
        </li>
        <li>
          The{' '}
          <a href="https://github.com/KaylahBuilds/runreveal-detection-as-code/tree/main/detections/sql">
            scheduled SQL examples
          </a>{' '}
          explore twenty WAF blocks per source IP and web ACL, or ten ALB server-error
          responses per source and host, in a five-minute received-time window. These are
          teaching thresholds, not measured baselines for your application. Review ordinary
          traffic, releases, health checks, and upstream failures before deciding what should alert.
        </li>
      </ul>
      <p>
        All three definitions start disabled, with automatic triage off and no notification
        destinations. Syncing a definition is not the same as authorizing it to run. Enable
        only the reviewed rule in the intended staging workspace after confirming its fields,
        expected matches, and routing.
      </p>
      <p>
        Test both sides of the boundary. Change a source type, remove a required field, or use
        an adjacent benign request. A positive-only test can keep passing after a condition
        becomes too broad. Keep schema assumptions explicit too: RunReveal documents WAF
        data in{' '}
        <a href="https://docs.runreveal.com/sources/source-types/aws/aws-waf">
          <code>aws_waf_logs</code>
        </a>{' '}
        and ALB data in{' '}
        <a href="https://docs.runreveal.com/sources/source-types/aws/alb">
          <code>http_logs</code>
        </a>.
        Similar-looking HTTP events do not guarantee identical field names or types.
      </p>

      <h3>A passing command must mean what you think it means</h3>
      <p>
        The vendor guide documents an unusual convention for streaming fixture runs: exit
        code zero means no match, while one means a match. Treating every nonzero exit as a
        broken test loses that distinction; treating every exit of one as a successful match
        can hide an engine failure. Verify the behavior of the pinned CLI and reject unexpected
        errors. The guide also limits this fixture-running path to streaming detections, so
        do not describe a scheduled SQL query as locally replayed simply because it was linted.
      </p>
      <p>
        For scheduled detection windows, RunReveal recommends{' '}
        <a href="https://docs.runreveal.com/detections/detection-as-code">
          received-time windowing with its supplied time parameters
        </a>{' '}
        to accommodate delayed source delivery. Validate boundary events and late arrival in
        staging. Record enough event-time context for an investigator without assuming the
        source timestamp and ingestion timestamp represent the same moment.
      </p>
      <p>
        The repository keeps credentialed deployment as an inactive template. Before enabling
        it, configure a dedicated staging workspace, protected deployment environment, and
        appropriately scoped credentials. GitHub’s{' '}
        <a href="https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments">
          deployment review controls
        </a>{' '}
        need to be configured in the repository; writing an environment name into YAML does
        not create a reviewer requirement. Use a dedicated lab workspace and review the
        synchronization preview carefully:{' '}
        <a href="https://docs.runreveal.com/detections/detection-as-code/deployment">
          omitted CLI-managed detections can be deleted
        </a>.
        The directory being synchronized must represent the intended managed inventory,
        not an accidental subset of a shared production workspace.
      </p>

      <h2>A validation checklist before promotion</h2>
      <ol>
        <li>
          Review the Terraform plan for unexpected replacements, broad permissions, retention
          changes, and ownership conflicts with existing logging resources.
        </li>
        <li>
          Confirm each new source’s bucket, queue, reader role, external ID, account, and Region
          agree. Ensure the other source’s resources are outside that reader’s intended scope.
        </li>
        <li>
          Generate harmless, authorized staging traffic. Find its log object, the ingested
          event, and the expected normalized fields before troubleshooting the detection.
        </li>
        <li>
          Run positive, negative, missing-field, and wrong-source cases. Distinguish local
          structural checks, native CLI behavior, and live workspace execution in the evidence.
        </li>
        <li>
          Exercise a broken ingestion path and a deliberately failing test. Verify that both
          are visible and neither can silently grant deployment authority.
        </li>
        <li>
          Preview synchronization in staging, inspect the resulting detections, and rehearse
          reverting a rule change. A Git revert still needs review and redeployment.
        </li>
      </ol>
      <p>
        The goal is not simply to store rules in Git. It is to make a detection explainable:
        where its evidence came from, which cases it handles, who approved its current logic,
        and what a responder should do next. Pair this with{' '}
        <a href="/#/blog/falco-runtime-security-tiers">runtime observations from Falco</a>{' '}
        and{' '}
        <a href="/#/blog/software-supply-chain-security-tiers">supply-chain controls</a>{' '}
        without confusing those different layers of evidence.
      </p>
    </>
  ),
};

export default post;
