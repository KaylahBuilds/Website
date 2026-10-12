const repo = 'https://github.com/KaylahBuilds/foundry-video-connectivity'

const post = {
  slug: 'foundry-video-connectivity-aws-terraform',
  title: 'AWS Networking for Foundry Video Integrations with Terraform',
  date: '2026-10-12',
  tags: ['terraform', 'AWS', 'networking', 'Palantir Foundry'],
  excerpt:
    'A connected socket is not a working stream. Build the right AWS network path for HTTPS, RTSP over TCP, or separate UDP media—with three Terraform examples and a practical validation checklist.',
  body: (
    <>
      <p className="section-label">AWS networking / Follow the media</p>
      <p>
        The client connects. Authentication succeeds. The screen stays black. With video,
        that can be a network problem even when the initial connection looks healthy:
        the commands that start playback and the packets carrying the picture may use
        different paths. Opening the control port is only part of the job.
      </p>
      <p>
        I built <a href={repo}>foundry-video-connectivity</a> to separate three designs:
        HTTPS through an Application Load Balancer, RTSP with media over the same TCP
        connection, and RTSP with separate UDP media. This guide explains how to choose
        one, configure its Terraform example, and test the result without turning a
        missing stream into an overly permissive firewall.
      </p>
      <div className="notice">
        <strong>Scope matters.</strong> These are AWS networking examples for a verified,
        compatible Foundry integration. They do not install a video service, create a
        Foundry connector, or demonstrate that your connector accepts RTSP. Confirm that
        compatibility before provisioning anything.
      </div>

      <h2>Confirm what Foundry will connect to</h2>
      <p>
        Start with the application owner and Foundry administrator. Identify the connector
        or approved gateway, its supported protocol and codec, where its worker runs,
        and how it authenticates. A codec describes how media is encoded; opening a network
        port cannot make an unsupported codec playable. If a gateway converts the feed,
        treat that gateway as a separate application with its own owner and deployment.
      </p>
      <p>
        Foundry source configuration includes network connectivity, credentials and,
        depending on the worker architecture, egress policy. Follow the{' '}
        <a href="https://www.palantir.com/docs/foundry/data-connection/set-up-source">
          Palantir source setup guidance
        </a>{' '}
        for your environment. Generic support for streaming data is not proof that a
        source accepts a raw camera feed.
      </p>
      <p>Write down these answers before choosing a module:</p>
      <ul>
        <li>Which endpoint initiates the session, and where does it run?</li>
        <li>Which protocol carries control, and which carries the media?</li>
        <li>Which addresses and destination ports will the actual receivers use?</li>
        <li>What provides routing, authentication and encryption along that path?</li>
      </ul>

      <h2>Choose among the three examples</h2>
      <p>
        RTSP, the Real Time Streaming Protocol, controls a media session. RTP carries
        media packets; RTCP carries reports and feedback about the media session. They
        can share a TCP connection or use separate UDP flows. The distinction determines
        which rules you need.
      </p>
      <div className="article-table-wrap" role="region" aria-label="Compare video networking examples" tabIndex={0}>
        <table className="article-comparison">
          <caption>Choose by the verified application transport, not the word streaming.</caption>
          <thead><tr><th scope="col">Transport</th><th scope="col">Example</th><th scope="col">What Terraform creates</th></tr></thead>
          <tbody>
            <tr><th scope="row">HTTPS</th><td><a href={`${repo}/tree/main/examples/https-alb`}>https-alb</a></td><td>An internal-by-default ALB, HTTPS listener, target group and scoped security groups</td></tr>
            <tr><th scope="row">RTSP with interleaved TCP media</th><td><a href={`${repo}/tree/main/examples/rtsp-tcp`}>rtsp-tcp</a></td><td>A security group for the selected AWS client or server role</td></tr>
            <tr><th scope="row">RTSP with separate UDP media</th><td><a href={`${repo}/tree/main/examples/rtsp-udp`}>rtsp-udp</a></td><td>A security group with explicit control, media and feedback directions</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        All three use an existing VPC and network path. The RTSP examples create no server,
        routes, load balancer or network-interface attachment. The HTTPS example also
        needs suitable subnets, a certificate and a working backend. Terraform cannot
        discover these application requirements from the word “video.”
      </p>

      <h2>Use an ALB for an HTTP based application</h2>
      <p>
        An Application Load Balancer understands HTTP and HTTPS, including WebSocket
        upgrades. It does not forward raw RTSP or UDP media and does not convert an
        RTSP feed into HTTPS. Use this example when the application or approved gateway
        already exposes the compatible HTTP-based interface. See{' '}
        <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html">
          AWS listener protocols
        </a>.
      </p>
      <pre tabIndex={0} aria-label="HTTPS traffic path"><code>{`Verified client or gateway
  -> ALB on HTTPS / TCP 443
  -> backend on HTTP / TCP 8080
     or explicitly configured HTTPS / TCP 8443`}</code></pre>
      <p>
        The module limits listener access to the supplied source CIDRs. A CIDR describes
        an address range; an IPv4 /32 identifies one address. Between the ALB and backend,
        security-group references limit access to the configured backend port. Health
        checks use that same port. Attach the backend group through the infrastructure
        that owns the target interfaces.
      </p>
      <p>
        The default is private, with deletion protection enabled. Supply subnets in at
        least two distinct Availability Zones and a regional ACM certificate for the
        hostname clients will request. DNS and the private route remain your
        responsibility. Resolving a private hostname does not make it reachable.
      </p>
      <p>
        Backend HTTP is plaintext. To encrypt that hop, configure an HTTPS-capable
        application and change both settings in your copied HTTPS example variables:
      </p>
      <pre tabIndex={0} aria-label="HTTPS backend settings"><code>{`backend_protocol = "HTTPS"
backend_port     = 8443`}</code></pre>
      <p>
        ALB does not validate target certificates, so this is not backend mutual TLS or
        certificate-based verification of the target identity. The{' '}
        <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html">
          AWS target group documentation
        </a>{' '}
        explains that behavior. Also, <code>target_ips</code> starts empty: register
        targets through their owning stack or supply the appropriate private target IPs.
        Creating a target group alone does not give the ALB somewhere to send requests.
      </p>

      <h2>Keep RTSP media on TCP when supported</h2>
      <p>
        With interleaved TCP, control and framed media share the RTSP connection. That
        gives the firewall fewer distinct flows to allow. It also means lost TCP data
        can delay later data on that connection. It is a transport tradeoff, not a
        promise of low latency. The{' '}
        <a href="https://www.rfc-editor.org/rfc/rfc7826.html#section-14">RTSP interleaving specification</a>{' '}
        describes the mechanism; verify the RTSP version and transport your application supports.
      </p>
      <p>The TCP example distinguishes who initiates:</p>
      <ul>
        <li><code>aws_role = "server"</code> allows inbound RTSP from the approved remote client.</li>
        <li><code>aws_role = "client"</code> allows outbound RTSP to the approved remote server.</li>
      </ul>
      <p>
        The example control port is TCP 554. Established response traffic is statefully
        tracked. There are no UDP rules. Verify that the client negotiated interleaving
        instead of silently falling back to UDP. Changing <code>aws_role</code> changes
        rules, not the behavior of the application. A remote server in this design is
        not necessarily Foundry; this is not a claim that Foundry exposes an RTSP endpoint.
      </p>

      <h2>Follow each UDP packet to its receiver</h2>
      <p>
        With separate media, the client first opens the RTSP control connection. The
        server then sends media to the client’s agreed receiver ports. The UDP example
        models an IPv4 unicast pull session: server-to-client RTP and RTCP, with RTCP
        feedback in the other direction. All flows use the same configured peer CIDR set.
      </p>
      <div className="article-table-wrap" role="region" aria-label="UDP media destination ports and directions" tabIndex={0}>
        <table className="article-comparison">
          <caption>Illustrative receiver ports, not Palantir requirements.</caption>
          <thead><tr><th scope="col">Traffic</th><th scope="col">Destination</th><th scope="col">If AWS is the server</th></tr></thead>
          <tbody>
            <tr><th scope="row">Client starts RTSP</th><td>Server TCP 554</td><td>Ingress</td></tr>
            <tr><th scope="row">Server sends RTP</th><td>Client UDP 5004</td><td>Egress</td></tr>
            <tr><th scope="row">Server sends RTCP</th><td>Client UDP 5005</td><td>Egress</td></tr>
            <tr><th scope="row">Client sends RTCP feedback</th><td>Server UDP 6001</td><td>Ingress</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Every port in that table is a <strong>destination</strong> port. Ingress describes
        an AWS receiver; egress describes a remote receiver. Selecting the AWS client
        role reverses the corresponding directions. After copying the UDP example’s
        complete variables file, this is the portion that describes those flows:
      </p>
      <pre tabIndex={0} aria-label="UDP example transport settings"><code>{`# Fragment of terraform.tfvars, not the complete file.
# Replace this documentation address with the verified peer.
aws_role        = "server"
peer_ipv4_cidrs = ["192.0.2.10/32"]
rtsp_port       = 554

client_rtp_ports  = { from = 5004, to = 5004 }
client_rtcp_ports = { from = 5005, to = 5005 }
server_rtcp_ports = { from = 6001, to = 6001 }`}</code></pre>
      <p>
        Terraform does not negotiate these ports. Configure the application and inspect
        its selected transport and advertised receiver addresses. RTCP is not universally
        “RTP plus one”; explicitly signaled ports and multiplexing change the arrangement.
        See the <a href="https://www.rfc-editor.org/rfc/rfc3550.html#section-11">RTP port conventions</a>.
      </p>
      <p>
        The module permits narrow, explicitly configured port ranges and caps each range
        at 32 ports as a lab guardrail. Separate control and media peers, multicast,
        bidirectional RTP or larger dynamic pools need additional design. Multiple
        concurrent sessions also need a deliberate port-allocation strategy.
      </p>
      <p>
        Security groups are stateful, but a TCP control session does not authorize a
        separate UDP media flow. Rules from all groups attached to an interface combine.
        Review them together, plus host firewalls and stateless network ACLs. AWS explains
        these <a href="https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html">security group rules</a>.
      </p>

      <h2>Do not treat an NLB as a protocol converter</h2>
      <p>
        A Network Load Balancer can forward TCP and UDP through configured listeners.
        That makes it an option for some controlled deployments, not an automatic fix
        for negotiated media. Its{' '}
        <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html">
          transport listeners
        </a>{' '}
        do not replace application-level session design.
      </p>
      <p>
        Ask which address the server advertises, whether the receiver can reach it after
        network address translation, and whether control and media arrive at the correct
        backend session. Fixed listener ports do not solve every dynamically allocated
        receiver port. This repository therefore starts RTSP with an existing routed
        connection; it does not provision an NLB or a media-aware gateway.
      </p>

      <h2>Run the checks before creating a lab</h2>
      <p>
        Install Git, Python 3.11 or newer and Terraform 1.9.8. The project pins AWS provider
        6.68.0. You need registry access for provider initialization, but no AWS credentials
        for the mocked tests. AWS CLI and an approved AWS sign-in workflow are needed
        for the later account check and deployment exercise.
      </p>
      <p>If your system exposes Python as <code>python3</code>, use that command in place of <code>python</code> below.</p>
      <pre tabIndex={0} aria-label="Clone and validate the repository"><code>{`git clone https://github.com/KaylahBuilds/foundry-video-connectivity.git
cd foundry-video-connectivity

# Offline repository checks
python -m unittest discover -s tests -p 'test_*.py' -v

# Formatting, provider initialization, validation and mock tests
python scripts/validate.py`}</code></pre>
      <p>
        On October 12, 2026, the{' '}
        <a href={`${repo}/actions/runs/38303819131`}>GitHub Actions run</a>{' '}
        passed all nine repository checks, formatting, provider-backed validation in
        five roots, and 50 mocked Terraform tests: 27 for HTTPS and 23 for RTSP.
        These checks exercise configuration, rule directions and rejected inputs.
        They do not prove a live stream works. No AWS deployment or end-to-end Foundry
        stream has been tested for these examples.
      </p>

      <h2>Plan one example in an isolated account</h2>
      <p>
        Read the chosen example’s README and confirm its prerequisites first. For UDP,
        copy its sample configuration:
      </p>
      <pre tabIndex={0} aria-label="Prepare the UDP lab variables"><code>{`cd examples/rtsp-udp
cp terraform.tfvars.example terraform.tfvars`}</code></pre>
      <p>
        In PowerShell, use <code>Copy-Item -LiteralPath terraform.tfvars.example -Destination terraform.tfvars</code>.
        Replace every placeholder with your account, region, VPC, application role, peer
        addresses and receiver ports. The all-zero account placeholder in the RTSP
        samples is deliberately rejected. Documentation CIDRs are not working peer addresses.
      </p>
      <p>
        Sign in using your organization’s approved AWS workflow. Then confirm identity
        and review a saved plan:
      </p>
      <pre tabIndex={0} aria-label="Check the account and create a Terraform plan"><code>{`aws sts get-caller-identity
terraform init
terraform validate
terraform plan -out=lab.tfplan`}</code></pre>
      <p>
        The provider account allowlist requires credentials matching <code>aws_account_id</code>.
        Check the account, region, resource ownership, CIDRs, port directions and costs.
        Only after approving that plan should you run <code>terraform apply lab.tfplan</code>.
        The ALB design creates chargeable infrastructure; these instructions are not a
        request to deploy into a production account.
      </p>
      <p>
        Attach the resulting security group through the stack that owns the intended
        network interfaces. Do not replace an interface’s full group list as a shortcut.
        Keep populated variables, state, plans, stream credentials and captures out of
        Git. Use approved credential storage rather than embedding authentication in a
        stream URL. The <a href={`${repo}/blob/main/SECURITY.md`}>security guide</a>{' '}
        covers these boundaries.
      </p>

      <h2>Validate playback rather than just the socket</h2>
      <p>
        Use an authorized test feed and the real client network path. Private addressing
        and security groups do not encrypt video. Choose a verified encrypted network
        path or compatible application-layer security for the content and credentials.
        Then collect evidence for each stage:
      </p>
      <ol>
        <li><strong>Reachability:</strong> the intended client reaches the correct service and authenticates.</li>
        <li><strong>Negotiation:</strong> the session selects the expected transport, receiver addresses and ports.</li>
        <li><strong>Delivery:</strong> media arrives and decodes; required RTCP feedback works independently.</li>
        <li><strong>Durability:</strong> sustained playback, idle periods, reconnects and concurrent clients behave as expected.</li>
        <li><strong>Access control:</strong> unauthorized networks and unauthenticated requests are rejected at the intended layer.</li>
      </ol>
      <p>
        If control works but the picture is missing, check receiver bindings, negotiated
        addresses, NAT and media directions before widening a firewall rule. If packets
        arrive but cannot be decoded, investigate the codec and payload. For HTTPS,
        verify target registration and application health; an HTTP health check alone
        does not demonstrate video delivery.
      </p>
      <p>
        Use the repository’s <a href={`${repo}/blob/main/VALIDATION.md`}>acceptance and cleanup checklist</a>{' '}
        to record results. When finished, review a destroy plan for only the resources
        this example owns. ALB deletion protection must be disabled through a reviewed
        change before removing the load balancer. Preserve shared VPCs, certificates
        and other infrastructure the example did not create.
      </p>
      <p>
        The useful question is not simply “Is the port open?” It is “Can this verified
        client establish the intended session, receive the media and keep playing within
        the access boundaries we designed?” That is the difference between a reachable
        endpoint and a working integration.
      </p>
      <p>
        <a href={repo}>Explore the Terraform examples on GitHub</a>. Independent educational
        examples; not endorsed by Palantir or AWS.
      </p>
    </>
  ),
}

export default post
