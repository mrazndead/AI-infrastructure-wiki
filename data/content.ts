import { Article, CategoryMap } from '../types';

export const wikiContent: Article[] = [
  // --- GETTING STARTED ---
  {
    id: 'getting-started-roadmap',
    title: 'Getting Started: The AI Infrastructure Roadmap',
    category: 'Getting Started',
    subcategory: 'Roadmap',
    readTime: '25 min read',
    excerpt: 'Your comprehensive, step-by-step guide to building an Enterprise AI platform. Navigating the stack from silicon selection to agent swarm orchestration.',
    date: '2024-12-14',
    tags: ['Roadmap', 'Architecture', 'Strategy'],
    content: `
# From Silicon to Swarms: The Enterprise AI Stack

Building an AI platform is fundamentally different from traditional web infrastructure. It represents a shift from **stateless, CPU-bound microservices** to **stateful, massive-parallel compute workloads**. In a traditional web app, if a request fails, you retry it. In distributed training, if one packet drops or one GPU hangs, a month-long training run costing $1M+ can stall.

This guide outlines the logical progression of building an Enterprise AI stack, layer by layer.

---

## Phase 1: The Compute Layer (Hardware Selection)

Everything starts with the GPU. The choice of silicon dictates your software stack, your cooling requirements, and your networking topology.

### Training Foundation Models
If your goal is pre-training or massive fine-tuning (100B+ parameters), you need raw BF16 TFLOPS and massive memory bandwidth.
*   **The Gold Standard:** [NVIDIA H100 vs Blackwell B200](#article:h100-vs-b200). The H100 is the current workhorse, but the B200 introduces FP4 precision, effectively doubling throughput for compatible workloads.
*   **The Cloud Natives:** [Google TPU v5p](#article:tpu-v5p-architecture) and [AWS Trainium2](#article:trainium2-aws) offer significant cost savings if you are willing to lock into their respective ecosystems (JAX for TPU, Neuron SDK for AWS).
*   **Wafer-Scale:** For specialized tasks requiring minimal latency, [Cerebras WSE-3](#article:cerebras-wse3) keeps the entire model on a single wafer, eliminating off-chip communication penalties.

### Inference at Scale
Serving models is about *cost per token* and *latency*.
*   **Low Latency (Interactive):** [Groq LPU](#article:lpu-inference) uses SRAM to deliver instant responses, ideal for voice agents.
*   **High Throughput (Batch):** [AMD MI300X](#article:mi300x-vs-h100) provides 192GB of VRAM, allowing you to run larger batch sizes or serve larger models (like Llama-3-70B) on fewer chips, improving unit economics.

---

## Phase 2: The Nervous System (High-Performance Networking)

In distributed AI, the network is often the bottleneck. When training across 1,000 GPUs, they must exchange gradients constantly (All-Reduce).

*   **The Fabric War:** [Infiniband vs Spectrum-X Ethernet](#article:infiniband-vs-ethernet). Infiniband (IB) has historically been required for its native Remote Direct Memory Access (RDMA) and lack of jitter. However, Spectrum-X brings RDMA over Converged Ethernet (RoCEv2) with telemetry-based congestion control, challenging IB's dominance.
*   **The Scale Up:** Inside the node, [NVLink Switch Systems](#article:nvlink-switch-systems) create a unified memory address space, allowing all GPUs to access each other's VRAM at 900GB/s+.
*   **The Physics:** As speeds hit 800Gbps per port, copper cables run into physics limitations. We are moving toward [Co-Packaged Optics (CPO)](#article:optical-interconnects) to bring the photonics engine directly onto the GPU substrate.

---

## Phase 3: The Orchestration Layer (Ops & Scheduling)

How do you manage 1,000 GPUs without losing your mind?

*   **Kubernetes for AI:** Standard K8s is unaware of GPU topology. You need advanced scheduling to ensure pods land on GPUs that are physically close. Read about [Kubernetes GPU Scheduling](#article:kubernetes-gpu-scheduling), NUMA awareness, and the NVIDIA GPU Operator.
*   **The HPC Legacy:** For pure batch jobs, [Slurm Workload Manager](#article:slurm-workload-manager) remains the gold standard. It offers rigid gang scheduling (all-or-nothing allocation), which is critical for training jobs that cannot tolerate "straggler" nodes.
*   **The Pythonic Abstraction:** [Ray Distributed Clusters](#article:ray-distributed-training) sits on top of K8s/Slurm, allowing Python developers to scale code without writing YAML.

---

## Phase 4: Training & Optimization (The Software Stack)

Hardware Utilization (MFU) is the metric that matters. Buying H100s and running them at 20% utilization is burning money.

*   **Parallelism Strategies:** [PyTorch FSDP](#article:pytorch-fsdp) (Fully Sharded Data Parallel) and [Megatron-LM](#article:megatron-lm) (Tensor/Pipeline Parallelism) are required to fit models that exceed a single GPU's memory.
*   **Compiler Optimization:** [JAX / XLA](#article:jax-xla-compiler) and [Torch Compile] optimize the computational graph, fusing kernels to reduce memory access overhead.
*   **Memory Tricks:** [FlashAttention-2](#article:flash-attention-explained) rewrites the attention mechanism to stay within fast SRAM, while [Checkpointing Strategies](#article:checkpointing-strategies) ensure you can resume training after a node failure without losing days of progress.

---

## Phase 5: Inference & Serving

Once trained, models must be served efficiently.

*   **The Engines:** Raw PyTorch is too slow. [vLLM](#article:vllm-paged-attention) introduces PagedAttention to solve memory fragmentation. [TensorRT-LLM](#article:tensorrt-llm-deployment) compiles models into optimized CUDA kernels for maximum throughput.
*   **Quantization:** [AWQ and GPTQ](#article:quantization-awq-gptq) allow you to run models in 4-bit precision with minimal accuracy loss, doubling the effective VRAM capacity.

---

## Phase 6: Application Layer (Agents & RAG)

The final layer is building the application logic that users interact with.

*   **RAG:** [Enterprise RAG Patterns](#article:rag-architecture-patterns) involve hybrid search, re-ranking, and [Vector Databases](#article:vector-databases-overview) to ground the model in your data.
*   **Agentic Workflows:** Frameworks like [Microsoft AutoGen](#article:autogen-framework) and [CrewAI](#article:crewai-task-delegation) allow multiple specialized agents to collaborate, plan, and execute complex tasks.
    `
  },

  // --- HARDWARE / COMPUTE SILICON ---
  {
    id: 'h100-vs-b200',
    title: 'Deep Dive: NVIDIA H100 vs Blackwell B200',
    category: 'Hardware',
    subcategory: 'Compute',
    readTime: '20 min read',
    excerpt: 'An exhaustive technical comparison of Hopper and Blackwell architectures. Analyzing FP4 precision, NV-HBI, thermal envelopes, and TCO.',
    date: '2024-10-20',
    tags: ['GPU', 'NVIDIA', 'H100', 'B200', 'Architecture'],
    content: `
# The Generational Leap: From Hopper to Blackwell

The transition from NVIDIA's Hopper (H100) architecture to Blackwell (B200) represents a fundamental architectural shift designed to address the "Memory Wall" and the "Power Wall" simultaneously.

## 1. The Silicon Architecture

### The H100 (Hopper)
The H100 is a monolithic die (814mm²) built on TSMC 4N. It introduced the **Transformer Engine**, dynamically casting between FP8 and FP16/BF16.
*   **Transistors:** 80 Billion
*   **Memory:** 80GB HBM3 (SXM5 version)
*   **Interconnect:** NVLink Gen 4 (900 GB/s)

### The B200 (Blackwell)
The B200 hits the reticle limit. NVIDIA utilized a **Multi-Chip Module (MCM)** design, stitching two dies on a CoWoS-L interposer.
*   **Unified Logic:** The two dies are connected by **NV-HBI** at 10 TB/s. Software sees *one* GPU.
*   **Transistors:** 208 Billion
*   **Memory:** 192GB HBM3e
*   **Interconnect:** NVLink Gen 5 (1.8 TB/s)

## 2. Precision and The Transformer Engine Gen 2
Blackwell introduces **FP4** support. For inference, this effectively doubles throughput compared to FP8, allowing the B200 to hit **20 PFLOPS** of dense AI performance.

## 3. The Thermal Challenge
*   **H100 TDP:** 700W (Air Cooled).
*   **B200 TDP:** 1000W - 1200W. This power density effectively mandates **Direct Liquid Cooling (DLC)**.
    `,
    chartData: {
      type: 'comparison',
      title: 'Architectural Comparison',
      seriesLabels: ['H100 SXM', 'B200'],
      data: [
        { label: 'FP8 Compute (PFLOPS)', value: 4, value2: 10 },
        { label: 'FP4 Compute (PFLOPS)', value: 0, value2: 20 },
        { label: 'Memory Capacity (GB)', value: 80, value2: 192 },
        { label: 'Mem Bandwidth (TB/s)', value: 3.35, value2: 8.0 }
      ],
      yAxisLabel: ''
    }
  },
  {
    id: 'mi300x-vs-h100',
    title: 'AMD MI300X: The Challenger',
    category: 'Hardware',
    subcategory: 'Compute',
    readTime: '15 min read',
    excerpt: 'Analysis of AMD\'s CDNA 3 architecture. How 192GB HBM3 and chiplet design offer superior unit economics for LLM inference.',
    date: '2024-11-05',
    tags: ['AMD', 'MI300X', 'HBM3', 'Hardware'],
    content: `
# The Memory Capacity King

While NVIDIA dominates training, AMD has positioned the MI300X as the ultimate inference engine.
*   **4 IO Dies + 8 XCDs:** A marvel of advanced packaging.
*   **Unified Memory:** **192GB of HBM3** memory with 5.3 TB/s bandwidth.
*   **TCO:** You can fit Llama-3-70B on a single MI300X, whereas H100 requires splitting it across two cards.
    `
  },
  {
    id: 'tpu-v5p-architecture',
    title: 'Google TPU v5p: The Pod Architecture',
    category: 'Hardware',
    subcategory: 'Compute',
    readTime: '15 min read',
    excerpt: 'Inside the proprietary Inter-Chip Interconnect (ICI) and the 3D Torus topology that powers Google Gemini.',
    date: '2024-10-18',
    tags: ['TPU', 'Google', 'Hardware', 'JAX'],
    content: `
# Built for Transformers

Google's TPU v5p is a Domain Specific Architecture (DSA) built *only* for matrix multiplication.
*   **MXU:** Systolic arrays pump data through 128x128 ALUs.
*   **ICI (Inter-Chip Interconnect):** Direct copper links form a **3D Torus** topology. A TPU Pod (8,960 chips) behaves like one massive computer, free from Ethernet overhead.
*   **Sparse Cores:** Accelerated support for Mixture-of-Experts (MoE) models.
    `
  },
  {
    id: 'trainium2-aws',
    title: 'AWS Trainium2 & Neuron SDK',
    category: 'Hardware',
    subcategory: 'Cloud Silicon',
    readTime: '14 min read',
    excerpt: 'Inside Amazon\'s custom silicon. The NeuronCore-v2 architecture, collective communications, and the EC2 Trn2 instance.',
    date: '2024-12-05',
    tags: ['AWS', 'Trainium', 'Silicon'],
    content: `
# Vertical Integration at Scale

AWS Trainium2 aims to break the NVIDIA monopoly for Anthropic and internal workloads.
*   **Performance:** 4x faster training than Trainium1.
*   **Memory:** 96GB HBM2e.
*   **Networking:** Elastic Fabric Adapter (EFA) is integrated directly.
*   **Neuron SDK:** The XLA-based compiler stack that translates PyTorch into instructions for the NeuronCore.
    `
  },
  {
    id: 'cerebras-wse3',
    title: 'Cerebras WSE-3: Wafer-Scale Physics',
    category: 'Hardware',
    subcategory: 'Wafer Scale',
    readTime: '12 min read',
    excerpt: 'Understanding the physics of the world\'s largest chip. How keeping memory on-wafer eliminates the memory wall entirely.',
    date: '2024-11-12',
    tags: ['Cerebras', 'Hardware', 'WSE-3'],
    content: `
# Breaking the Reticle Limit

Standard chips are limited by the size of the light reticle (~800mm²). Cerebras uses the **entire silicon wafer**.
*   **Size:** 46,225mm² (approx. 57x larger than an H100).
*   **Memory:** 44GB of **On-Chip SRAM** with **21 PB/s bandwidth**.
*   **Benefit:** The entire model stays on chip. No HBM bottlenecks. Perfect for low-latency batch-1 inference.
    `
  },
  {
    id: 'lpu-inference',
    title: 'Groq LPU: Deterministic Latency',
    category: 'Hardware',
    subcategory: 'Inference',
    readTime: '10 min read',
    excerpt: 'Why Groq is faster than everyone else. The TSP architecture, SRAM dependency, and the end of dynamic scheduling.',
    date: '2024-11-20',
    tags: ['Groq', 'Inference', 'LPU'],
    content: `
# The End of Dynamic Scheduling

GPUs use dynamic schedulers (warp schedulers) to hide latency. Groq's LPU (Language Processing Unit) is **deterministic**.
*   **Compiler-Driven:** The compiler knows the location of every electron at every clock cycle. No cache misses, no branch prediction penalties.
*   **SRAM-Only:** 230MB of ultra-fast SRAM per chip.
*   **Result:** Instant Time-To-First-Token (TTFT) and massive tokens/sec for Batch-1 workloads.
    `
  },
  {
    id: 'gaudi3-architecture',
    title: 'Intel Gaudi 3: The Ethernet Native',
    category: 'Hardware',
    subcategory: 'Compute',
    readTime: '15 min read',
    excerpt: 'Why Intel put 24x 200Gb Ethernet ports directly on the die. Eliminating the need for specialized Infiniband switches.',
    date: '2024-12-10',
    tags: ['Intel', 'Gaudi', 'Ethernet'],
    content: `
# Networking is the Computer

Intel Gaudi 3 integrates standard **RoCE Ethernet** directly onto the compute die.
*   **Compute:** Two chiplets with 64 Tensor Processor Cores (TPCs).
*   **Networking:** **24 x 200Gb Ethernet ports on every chip**.
*   **Advantage:** You can build massive clusters using standard, cheaper Ethernet switches (Cisco/Arista) rather than proprietary NVLink or Infiniband fabrics.
    `
  },
  {
    id: 'tesla-dojo-d1',
    title: 'Tesla Dojo D1: The Video Supercomputer',
    category: 'Hardware',
    subcategory: 'Compute',
    readTime: '12 min read',
    excerpt: 'Analyzing Tesla\'s D1 chip and Training Tile. Designed specifically for video auto-labeling and Full Self Driving (FSD).',
    date: '2024-11-25',
    tags: ['Tesla', 'Dojo', 'ASIC'],
    content: `
# 100% Dark Silicon Free

The D1 chip was designed by Tesla because GPUs were "too general." GPUs have hardware for graphics (texture mapping, rasterization) that AI doesn't need.
*   **The Mesh:** D1 chips are connected in a 2D mesh format without external wires.
*   **Training Tile:** 25 D1 chips are packaged into a single "Training Tile" that acts as a unified compute node.
*   **Bandwidth:** The system focuses on massive bandwidth preservation to handle the petabytes of video data streaming from the Tesla fleet.
    `
  },
  {
    id: 'custom-ai-asics',
    title: 'The Rise of Custom AI ASICs',
    category: 'Hardware',
    subcategory: 'ASIC',
    readTime: '14 min read',
    excerpt: 'Meta MTIA, Microsoft Maia, and Google TPU. Why hyperscalers are abandoning merchant silicon for custom chips.',
    date: '2024-12-02',
    tags: ['ASIC', 'Meta', 'Microsoft', 'Hardware'],
    content: `
# The TCO Equation

When you spend $10B a year on GPUs, the 50% margin NVIDIA charges becomes a target.
*   **Meta MTIA:** Designed specifically for **Recommendation Systems** (DLRM), not just LLMs. It optimizes for memory bandwidth and embedding table lookups.
*   **Microsoft Maia 100:** Built for Azure's specific rack power envelopes. Features a massive "Sidekick" liquid cooler to fit into existing data centers.
*   **Google TPU:** The pioneer. Now on version 6 (Trillium), focusing on power efficiency per watt.
    `
  },
  {
    id: 'fpga-acceleration',
    title: 'FPGA Acceleration: Xilinx Alveo',
    category: 'Hardware',
    subcategory: 'FPGA',
    readTime: '12 min read',
    excerpt: 'When GPUs are too static. Using Field Programmable Gate Arrays for low-latency financial AI and custom data ingestion.',
    date: '2024-11-15',
    tags: ['FPGA', 'Xilinx', 'Hardware'],
    content: `
# Hardware that updates like Software

FPGAs (Field Programmable Gate Arrays) allow you to rewire the circuit at runtime.
*   **Latency:** FPGAs provide deterministic latency, critical for High Frequency Trading (HFT) AI models where microseconds matter.
*   **Data Ingestion:** The Xilinx Alveo cards are often used in the "Smart NIC" layer to pre-process data (decompression, decryption) before it even hits the GPU, saving PCIe bandwidth.
    `
  },
  {
    id: 'edge-tpu-jetson',
    title: 'Edge AI: Jetson Orin & Coral',
    category: 'Hardware',
    subcategory: 'Edge',
    readTime: '10 min read',
    excerpt: 'Running LLMs on 15 Watts. The constraints of edge computing and the rise of SLMs (Small Language Models).',
    date: '2024-11-30',
    tags: ['Edge', 'Jetson', 'IoT'],
    content: `
# AI in the Physical World

Cloud AI is great, but robots need local brains.
*   **NVIDIA Jetson Orin:** effectively a miniature A100. It shares the same CUDA architecture, allowing developers to deploy the same containers used in the cloud to a robot.
*   **Google Coral (Edge TPU):** An ASIC optimized for INT8 inference. Extremely low power (2W), perfect for detection tasks, but struggles with Generative AI.
*   **Optimization:** Running Llama-3-8B on edge requires 4-bit quantization and aggressive kernel optimization (TensorRT) to fit in 16GB shared RAM.
    `
  },

  // --- HARDWARE / PHYSICAL INFRA ---
  {
    id: 'infiniband-vs-ethernet',
    title: 'Infiniband NDR vs Spectrum-X Ethernet',
    category: 'Infrastructure',
    subcategory: 'Networking',
    readTime: '18 min read',
    excerpt: 'The battle for the AI backend network. Deep dive into RDMA, Congestion Control, Packet Spraying, and why Ethernet is finally catching up.',
    date: '2024-10-15',
    tags: ['Networking', 'Infiniband', 'Ethernet', 'RoCE'],
    content: `
# The Nervous System of AI

In distributed training, the network is not just a pipe; it is part of the compute.
*   **Infiniband (IB):** Native RDMA, Credit-Based Flow Control (no packet drops), and Adaptive Routing. The gold standard for Superpods.
*   **Spectrum-X Ethernet:** Uses telemetry to throttle senders *before* buffers overflow. Introduces packet spraying to utilize all paths, bringing Ethernet to near-IB performance levels for a lower cost.
    `
  },
  {
    id: 'nvlink-switch-systems',
    title: 'NVLink Switch Systems (NVSwitch)',
    category: 'Infrastructure',
    subcategory: 'Networking',
    readTime: '14 min read',
    excerpt: 'How NVSwitch enables 256 GPUs to act as one. The SHARP protocol and in-network computing explained.',
    date: '2024-12-01',
    tags: ['NVSwitch', 'NVLink', 'Hardware'],
    content: `
# Escaping the Node

PCIe is too slow. NVLink allows GPUs to talk at 900 GB/s.
**NVSwitch** takes this outside the chassis.
*   **NVL72:** Connects 72 GPUs in a rack via a copper backplane.
*   **SHARP (Scalable Hierarchical Aggregation and Reduction Protocol):** The switch itself performs the math. Instead of GPUs exchanging data and adding it up, they send data to the switch, the switch adds it, and sends back the result. This reduces traffic by 2x.
    `
  },
  {
    id: '800g-osfp-optics',
    title: '800G OSFP Optics & Transceivers',
    category: 'Infrastructure',
    subcategory: 'Networking',
    readTime: '12 min read',
    excerpt: 'The physical layer of AI. SR8 vs DR8, power consumption of transceivers, and the move to 1.6T.',
    date: '2024-11-20',
    tags: ['Optics', 'Networking', 'Hardware'],
    content: `
# Moving Photons

To feed an H100, you need 400Gb/s or 800Gb/s of network throughput.
*   **OSFP (Octal Small Form-factor Pluggable):** The form factor of choice. It has a massive heat sink because the DSP (Digital Signal Processor) inside gets incredibly hot.
*   **SR8 (Short Range):** Uses multi-mode fiber. Cheap, but limited to 50m.
*   **DR8 (Data Center Reach):** Uses single-mode fiber. Expensive, but goes 500m+.
    `
  },
  {
    id: 'optical-interconnects',
    title: 'The Future: Co-Packaged Optics (CPO)',
    category: 'Infrastructure',
    subcategory: 'Networking',
    readTime: '12 min read',
    excerpt: 'Copper cabling is hitting the physics limit. Moving the photonics engine directly onto the GPU package to save power.',
    date: '2024-12-02',
    tags: ['Physics', 'Optics', 'Hardware'],
    content: `
# The Retimer Tax

As we move from 400G to 800G, electrical signals degrade over inches of copper.
**CPO** moves the laser/transceiver directly onto the GPU substrate.
*   **Power:** Saves ~30% of switch power by removing "Retimers" (signal boosters).
*   **Latency:** Speed of light communication directly from the die.
    `
  },
  {
    id: 'hbm3e-explained',
    title: 'HBM3e Memory Stacks Explained',
    category: 'Hardware',
    subcategory: 'Memory',
    readTime: '10 min read',
    excerpt: 'TSVs, 2.5D Packaging, and why memory bandwidth is the bottleneck for all LLMs.',
    date: '2024-10-25',
    tags: ['HBM', 'Memory', 'Hardware'],
    content: `
# The Most Expensive Part of the GPU

High Bandwidth Memory (HBM) is not soldered onto the board; it is stacked vertically.
*   **TSV (Through Silicon Vias):** Microscopic holes drilled through the silicon dies to connect the stacks vertically.
*   **HBM3e:** The latest generation running at 9.6 Gbps per pin.
*   **Yield:** If one layer in the stack fails, the whole stack is trash. This manufacturing complexity is why H100s are supply-constrained.
    `
  },
  {
    id: 'immersion-cooling',
    title: 'Direct-to-Chip vs Immersion Cooling',
    category: 'Infrastructure',
    subcategory: 'Cooling',
    readTime: '16 min read',
    excerpt: 'Physics and economics of cooling 100kW racks. Cold plates, single-phase immersion, and two-phase immersion explained.',
    date: '2024-10-01',
    tags: ['Cooling', 'DataCenter', 'Sustainability'],
    content: `
# The Heat Wall

Air cooling fails at >50kW per rack. Blackwell racks are 120kW.
*   **DLC (Direct Liquid Cooling):** Cold plates sit on the GPU. Water captures 80% of heat.
*   **Immersion:** Submerge the server in dielectric fluid. Captures 100% of heat but makes maintenance messy (cranes required).
*   **Two-Phase:** Fluid boils on the chip. Highest efficiency, but uses expensive/hazardous fluids (PFAS).
    `
  },
  {
    id: 'power-delivery-busbars',
    title: '48V Busbars & OCP Racks',
    category: 'Infrastructure',
    subcategory: 'Power',
    readTime: '10 min read',
    excerpt: 'Why 12V cables melt in AI racks. The shift to 48V/54V DC distribution and blind-mate connectors.',
    date: '2024-12-08',
    tags: ['Power', 'OCP', 'Hardware'],
    content: `
# Ohm's Law vs AI

To deliver 120kW at 12V, you need 10,000 Amps. The cables would be impossible.
**48V Architecture:** Increasing voltage by 4x reduces current by 4x, and resistive losses by 16x.
**Busbars:** Solid copper bars replace cables. Servers "blind mate" into the power shelf.
    `
  },
  {
    id: 'rear-door-heat-exchangers',
    title: 'Rear Door Heat Exchangers (RDHx)',
    category: 'Infrastructure',
    subcategory: 'Cooling',
    readTime: '10 min read',
    excerpt: 'The bridge between air and liquid. Using massive radiators to neutralize rack exhaust heat.',
    date: '2024-11-28',
    tags: ['Cooling', 'DataCenter'],
    content: `
# Neutralizing the Hot Aisle

If you can't do Direct Liquid Cooling yet, RDHx is the solution.
*   **Concept:** A massive radiator replaces the rear door of the server rack.
*   **Physics:** Hot air leaves the servers, passes through the water-cooled coil in the door, and enters the room at room temperature.
*   **Benefit:** Allows high-density racks in legacy data centers without changing the room air conditioning.
    `
  },
  {
    id: 'green-energy-nuclear',
    title: 'Nuclear & SMRs for AI Power',
    category: 'Infrastructure',
    subcategory: 'Sustainability',
    readTime: '14 min read',
    excerpt: 'The search for Gigawatts. Why AWS and Microsoft are buying nuclear plants.',
    date: '2024-11-23',
    tags: ['Sustainability', 'Power', 'Nuclear'],
    content: `
# The 1GW Cluster

AI training loads are flat and constant (24/7). Solar/Wind are intermittent.
*   **Baseload:** AI needs nuclear.
*   **SMRs (Small Modular Reactors):** Factory-built reactors placed directly on the data center campus ("Behind the meter") to bypass grid congestion.
    `
  },
  {
    id: 'data-center-security-soc2',
    title: 'Tier 4 Data Center Security',
    category: 'Infrastructure',
    subcategory: 'Security',
    readTime: '12 min read',
    excerpt: 'Protecting the model weights. Air gapping, biometric access, and supply chain security.',
    date: '2024-12-12',
    tags: ['Security', 'Compliance', 'Ops'],
    content: `
# The $100 Billion Asset

Model weights are the crown jewels.
*   **Physical:** Tier 4 centers use man-traps, biometrics, and armed guards.
*   **Air Gapping:** The training cluster management network should have no route to the internet.
*   **Supply Chain:** Ensuring the GPU firmware hasn't been compromised at the factory to leak gradients.
    `
  },

  // --- SOFTWARE / TRAINING STACK ---
  {
    id: 'pytorch-fsdp',
    title: 'PyTorch FSDP: Fully Sharded Data Parallel',
    category: 'Software',
    subcategory: 'Training',
    readTime: '16 min read',
    excerpt: 'Breaking the GPU memory limit. Sharding parameters, gradients, and optimizer states across the cluster.',
    date: '2024-10-10',
    tags: ['PyTorch', 'Training', 'FSDP'],
    content: `
# Beyond DDP

Distributed Data Parallel (DDP) replicates the entire model on every GPU. This fails when the model > GPU Memory.
**FSDP (Fully Sharded Data Parallel)** shards everything:
1.  **Parameters:** The weights themselves are split.
2.  **Gradients:** The learned updates are split.
3.  **Optimizer States:** The AdamW history is split.
*   **Communication:** GPUs fetch shards on-demand during the forward/backward pass. It trades networking bandwidth for memory capacity.
    `
  },
  {
    id: 'jax-xla-compiler',
    title: 'JAX & XLA: The Compiler Approach',
    category: 'Software',
    subcategory: 'Training',
    readTime: '15 min read',
    excerpt: 'Why Google uses JAX. Pure functions, XLA fusion, and the advantage of static graph compilation.',
    date: '2024-11-02',
    tags: ['JAX', 'XLA', 'Google'],
    content: `
# Functional Programming for AI

PyTorch is "Eager" (run line by line). JAX is "Compiled".
*   **XLA (Accelerated Linear Algebra):** A compiler that sees the whole math graph. It fuses operations (MatMul + Bias + ReLU) into a single kernel, reducing memory reads.
*   **pmap & pjit:** JAX primitives allow you to define how data and models are partitioned across thousands of TPUs with simple decorators.
    `
  },
  {
    id: 'ray-distributed-training',
    title: 'Scaling Python with Ray Cluster',
    category: 'Software',
    subcategory: 'Training',
    readTime: '18 min read',
    excerpt: 'The universal compute substrate. Orchestrating PyTorch, Data Loading, and Serving on K8s.',
    date: '2024-09-20',
    tags: ['Ray', 'Python', 'Distributed'],
    content: `
# The Glue of the AI Stack

Ray converts Python functions into distributed microservices.
*   **Ray Train:** Orchestrates PyTorch DDP/FSDP jobs, handling fault tolerance (restarting workers if they die).
*   **Ray Data:** Steaming data loader that pipelines fetching from S3 with GPU computation, hiding I/O latency.
    `
  },
  {
    id: 'kubernetes-gpu-scheduling',
    title: 'Advanced Kubernetes GPU Scheduling',
    category: 'Software',
    subcategory: 'Orchestration',
    readTime: '22 min read',
    excerpt: 'NUMA alignment, Topology Aware Scheduling, and the NVIDIA GPU Operator.',
    date: '2024-10-05',
    tags: ['Kubernetes', 'DevOps', 'GPU'],
    content: `
# Making K8s Hardware Aware

Standard K8s doesn't understand GPU topology.
*   **GPU Operator:** Automates driver and container toolkit installation.
*   **Topology Manager:** Ensures pods land on GPUs connected to the same CPU socket (NUMA node) to avoid QPI bottlenecks.
*   **Bin Packing:** Aggressively packs jobs to free up full nodes for large training runs.
    `
  },
  {
    id: 'slurm-workload-manager',
    title: 'Slurm: The HPC Standard',
    category: 'Software',
    subcategory: 'Orchestration',
    readTime: '14 min read',
    excerpt: 'Gang scheduling, Backfill, and why Supercomputers still refuse to use Kubernetes.',
    date: '2024-12-01',
    tags: ['Slurm', 'HPC', 'Ops'],
    content: `
# Synchronous scale

*   **Gang Scheduling:** Ensures all 1,000 nodes start at the exact same microsecond.
*   **Topology Awareness:** Slurm can request nodes connected to specific leaf switches to minimize network hops.
*   **Pyxis/Enroot:** The modern way to run Docker containers on Slurm without root privileges.
    `
  },
  {
    id: 'megatron-lm',
    title: 'Megatron-LM: 3D Parallelism',
    category: 'Software',
    subcategory: 'Training',
    readTime: '16 min read',
    excerpt: 'How NVIDIA trains massive models. Tensor Parallelism, Pipeline Parallelism, and Data Parallelism combined.',
    date: '2024-11-10',
    tags: ['NVIDIA', 'Megatron', 'Training'],
    content: `
# The 3D Strategy

To train a 1T parameter model, one technique isn't enough.
1.  **Tensor Parallelism (TP):** Splits a single matrix multiply across GPUs (Intra-node). High bandwidth required (NVLink).
2.  **Pipeline Parallelism (PP):** Splits layers across nodes (Inter-node). Layer 1 on Node A, Layer 2 on Node B.
3.  **Data Parallelism (DP):** Replicates the whole setup to process more data.
    `
  },
  {
    id: 'deepspeed-optimization',
    title: 'DeepSpeed & ZeRO Optimization',
    category: 'Software',
    subcategory: 'Optimization',
    readTime: '15 min read',
    excerpt: 'Microsoft\'s optimization library. Zero Redundancy Optimizer (ZeRO) Stages 1, 2, and 3 explained.',
    date: '2024-11-12',
    tags: ['Microsoft', 'DeepSpeed', 'Training'],
    content: `
# ZeRO Waste

DeepSpeed introduced ZeRO to eliminate memory redundancy.
*   **Stage 1:** Shard Optimizer States (4x memory reduction).
*   **Stage 2:** Shard Gradients (8x memory reduction).
*   **Stage 3:** Shard Parameters (Linear memory reduction with GPUs).
*   **ZeRO-Offload:** Push optimizer states to CPU RAM or NVMe to train huge models on limited VRAM.
    `
  },
  {
    id: 'mosaicml-foundry',
    title: 'MosaicML & LLM Foundry',
    category: 'Software',
    subcategory: 'Training',
    readTime: '12 min read',
    excerpt: 'Deterministic training and streaming datasets. How to train LLMs without the headaches.',
    date: '2024-11-28',
    tags: ['MosaicML', 'Training', 'Databricks'],
    content: `
# Streaming Datasets

Downloading 10TB of text to local disk is slow and expensive.
*   **Streaming:** MosaicML streams data directly from S3 to GPU memory in a deterministic order.
*   **Composer:** Their training library that includes algorithmic speedups (like ALiBi) out of the box.
    `
  },
  {
    id: 'checkpointing-strategies',
    title: 'Checkpointing: Saving State at Scale',
    category: 'Software',
    subcategory: 'Ops',
    readTime: '14 min read',
    excerpt: 'Handling the I/O burst. Asynchronous checkpointing and identifying silent data corruption.',
    date: '2024-12-05',
    tags: ['Storage', 'Ops', 'Reliability'],
    content: `
# The I/O Storm

When 10,000 GPUs save memory to disk simultaneously, storage dies.
*   **Async Checkpointing:** Copy state to CPU RAM first, then slowly trickle to disk while training continues.
*   **Distcp:** Distributed copy tools to move checkpoints from fast scratch NVMe to durable S3 storage.
    `
  },
  {
    id: 'docker-singularity-containers',
    title: 'Containers in HPC: Docker vs Singularity',
    category: 'Software',
    subcategory: 'Ops',
    readTime: '12 min read',
    excerpt: 'Why Docker requires root and why HPC centers hate it. The rise of Singularity (Apptainer) and Enroot.',
    date: '2024-11-18',
    tags: ['Docker', 'HPC', 'Containers'],
    content: `
# The Root Problem

Docker daemon runs as root. On a shared supercomputer, you can't give users root.
*   **Singularity (Apptainer):** Runs containers as a standard user. Encapsulates the environment in a single file (.sif).
*   **Enroot:** NVIDIA's tool to turn Docker images into unprivileged sandboxes, bridging the gap between cloud (Docker) and HPC (Slurm).
    `
  },
  {
    id: 'prometheus-grafana-monitoring',
    title: 'Monitoring GPU Clusters',
    category: 'Software',
    subcategory: 'Observability',
    readTime: '14 min read',
    excerpt: 'DCGM Exporter, Xid errors, and thermal throttling. Dashboards for cluster health.',
    date: '2024-11-22',
    tags: ['Monitoring', 'Prometheus', 'Ops'],
    content: `
# DCGM Exporter

NVIDIA DCGM (Data Center GPU Manager) exports metrics to Prometheus.
*   **Key Metrics:** Power Usage, SM Clock Frequencies, Memory Bandwidth utilization.
*   **Xid Errors:** The critical error codes (e.g., Xid 79: GPU has fallen off the bus) that trigger automated node draining.
    `
  },
  {
    id: 'wandb-mlflow-tracking',
    title: 'Experiment Tracking: W&B vs MLFlow',
    category: 'Software',
    subcategory: 'MLOps',
    readTime: '12 min read',
    excerpt: 'Managing the chaos of 100 experiments. Logging loss curves, gradients, and model artifacts.',
    date: '2024-12-08',
    tags: ['WandB', 'MLFlow', 'MLOps'],
    content: `
# The Lab Notebook

*   **Weights & Biases (W&B):** The standard for deep learning. excellent visualization of loss curves and system metrics (GPU usage correlated with loss spikes).
*   **MLFlow:** Open source, better for model registry and lifecycle management (deploying the model after training).
    `
  },

  // --- SOFTWARE / INFERENCE & AGENTS ---
  {
    id: 'vllm-paged-attention',
    title: 'vLLM & PagedAttention',
    category: 'Software',
    subcategory: 'Inference',
    readTime: '15 min read',
    excerpt: 'Solving KV-cache fragmentation. How non-contiguous memory allocation increases throughput by 4x.',
    date: '2024-10-10',
    tags: ['vLLM', 'Inference', 'Optimization'],
    content: `
# Virtual Memory for LLMs

*   **Fragmentation:** Traditional serving wastes 60% of VRAM on empty slots for potential tokens.
*   **PagedAttention:** Breaks KV cache into blocks that can be stored anywhere in VRAM. Allows near-zero waste and massive batch sizes.
    `
  },
  {
    id: 'tensorrt-llm-deployment',
    title: 'NVIDIA TensorRT-LLM',
    category: 'Software',
    subcategory: 'Inference',
    readTime: '16 min read',
    excerpt: 'The compiled path. In-flight batching, graph rewriting, and FP8 kernel fusion.',
    date: '2024-11-28',
    tags: ['NVIDIA', 'TensorRT', 'Inference'],
    content: `
# Kernel Fusion

Compiles PyTorch graphs into optimized binaries.
*   **In-Flight Batching:** Dynamically injects new requests into a running batch as old ones finish.
*   **Performance:** Generally the fastest option on NVIDIA hardware, but harder to set up than vLLM.
    `
  },
  {
    id: 'triton-inference-server',
    title: 'Triton Inference Server',
    category: 'Software',
    subcategory: 'Inference',
    readTime: '14 min read',
    excerpt: 'The standard for production serving. Multi-model serving, dynamic batching, and ensemble pipelines.',
    date: '2024-12-02',
    tags: ['NVIDIA', 'Triton', 'Serving'],
    content: `
# One Server, Any Framework

Triton can serve TensorRT, PyTorch, ONNX, and Python backends simultaneously.
*   **Dynamic Batching:** Collects incoming requests for 5ms and groups them into a batch for the GPU.
*   **Ensembles:** Chain models together (Preprocessing -> Embedding -> LLM -> Postprocessing) in a single API call.
    `
  },
  {
    id: 'flash-attention-explained',
    title: 'FlashAttention-2 Explained',
    category: 'Software',
    subcategory: 'Optimization',
    readTime: '18 min read',
    excerpt: 'The IO-aware algorithm that changed everything. Tiling, Recomputation, and SRAM optimization.',
    date: '2024-10-25',
    tags: ['Research', 'CUDA', 'Optimization'],
    content: `
# Memory Access is the Bottleneck

Standard Attention is $O(N^2)$ in memory reads.
**FlashAttention** breaks the calculation into tiles that fit into the GPU's fast SRAM.
*   **Key Insight:** It re-computes parts of the attention matrix on the fly rather than writing them to slow HBM memory. Math is cheap; Memory IO is expensive.
    `
  },
  {
    id: 'openai-triton-dsl',
    title: 'OpenAI Triton DSL',
    category: 'Software',
    subcategory: 'Optimization',
    readTime: '14 min read',
    excerpt: 'Writing high-performance kernels in Python. Bypassing CUDA C++ for block-based programming.',
    date: '2024-12-05',
    tags: ['Triton', 'Python', 'CUDA'],
    content: `
# Democratizing Kernels

Writing CUDA C++ is hard. Triton allows you to write kernels in Python.
*   **Block Programming:** You think in blocks of data, not threads. The compiler handles memory coalescing and synchronization.
*   **Adoption:** Used by PyTorch 2.0 (Inductor) and Unsloth to generate ultra-fast code.
    `
  },
  {
    id: 'quantization-awq-gptq',
    title: 'Quantization: AWQ & GPTQ',
    category: 'Software',
    subcategory: 'Optimization',
    readTime: '16 min read',
    excerpt: 'Running 70B models on consumer hardware. The math of 4-bit weights and activation outliers.',
    date: '2024-12-01',
    tags: ['Quantization', 'Math', 'Inference'],
    content: `
# 4-bit Revolution

*   **GPTQ:** Quantizes weights row-by-row to minimize error. Fast inference.
*   **AWQ (Activation Aware):** Identifies the 1% of "salient" weights that are important for accuracy and protects them from quantization. Better accuracy.
    `
  },
  {
    id: 'vector-databases-overview',
    title: 'Vector Databases: Milvus, Pinecone, Pgvector',
    category: 'Software',
    subcategory: 'RAG',
    readTime: '15 min read',
    excerpt: 'Storing semantic meaning. HNSW indexing, IVFFlat, and choosing the right DB for RAG.',
    date: '2024-11-15',
    tags: ['VectorDB', 'Database', 'RAG'],
    content: `
# Beyond Keywords

Vector DBs store "Embeddings" (lists of numbers representing meaning).
*   **HNSW (Hierarchical Navigable Small World):** The graph algorithm used for fast approximate nearest neighbor search.
*   **Pgvector:** Adding vector support to Postgres. Great for simplicity (one DB for everything).
*   **Pinecone/Milvus:** Specialized engines for billion-scale vectors.
    `
  },
  {
    id: 'rag-architecture-patterns',
    title: 'Enterprise RAG Patterns',
    category: 'Agents',
    subcategory: 'Architecture',
    readTime: '20 min read',
    excerpt: 'Hybrid Search, Re-ranking, and GraphRAG. Moving beyond naive semantic search.',
    date: '2024-10-12',
    tags: ['RAG', 'Architecture'],
    content: `
# Advanced Retrieval

*   **Hybrid Search:** Combine Vector search (semantic) with Keyword search (BM25) using Reciprocal Rank Fusion.
*   **Re-ranking:** Retrieve 50 docs, then use a Cross-Encoder (BGE-Reranker) to score them accurately.
*   **GraphRAG:** Using knowledge graphs to find connections between entities that vector search misses.
    `
  },
  {
    id: 'langchain-orchestration',
    title: 'LangChain Orchestration',
    category: 'Agents',
    subcategory: 'Frameworks',
    readTime: '14 min read',
    excerpt: 'Chains, Memories, and Tools. The framework that glued the early LLM stack together.',
    date: '2024-11-08',
    tags: ['LangChain', 'Python', 'Agents'],
    content: `
# The Glue

LangChain provides the abstractions to build apps.
*   **Chains:** Sequence of calls (Prompt -> LLM -> Parser).
*   **Memory:** Managing context windows (SummaryBufferMemory, WindowMemory).
*   **LCEL:** LangChain Expression Language for declarative composition.
    `
  },
  {
    id: 'autogen-framework',
    title: 'Microsoft AutoGen',
    category: 'Agents',
    subcategory: 'Frameworks',
    readTime: '15 min read',
    excerpt: 'Multi-agent conversation frameworks. Code executors and UserProxy agents.',
    date: '2024-11-17',
    tags: ['AutoGen', 'Microsoft', 'Agents'],
    content: `
# Agents that Code

AutoGen's superpower is the **UserProxyAgent** that can execute code locally.
*   **Workflow:** Agent writes python -> Proxy runs it -> Proxy sends error back -> Agent fixes code.
*   **GroupChat:** Orchestrating multiple specialized agents (Coder, Reviewer, Manager).
    `
  },
  {
    id: 'crewai-task-delegation',
    title: 'CrewAI: Role-Playing Agents',
    category: 'Agents',
    subcategory: 'Frameworks',
    readTime: '12 min read',
    excerpt: 'Structuring agents with specific roles, goals, and backstories. Task delegation and sequential processes.',
    date: '2024-12-05',
    tags: ['CrewAI', 'Agents', 'Python'],
    content: `
# Structured Swarms

CrewAI focuses on **Role-Playing**.
*   **Definition:** You define an agent's "Role" (e.g., Senior Analyst), "Goal" (Analyze trends), and "Backstory".
*   **Process:** Agents work in Sequential or Hierarchical processes to complete complex tasks, similar to a human org chart.
    `
  },
  {
    id: 'dspy-programming-models',
    title: 'DSPy: Compiling Prompts',
    category: 'Software',
    subcategory: 'Frameworks',
    readTime: '16 min read',
    excerpt: 'Stop writing prompts. Start writing signatures and optimizers.',
    date: '2024-11-16',
    tags: ['DSPy', 'Research', 'PromptEngineering'],
    content: `
# Programming, not Prompting

DSPy treats prompts as parameters to be optimized, not code to be written.
*   **Signatures:** Define Input/Output types.
*   **Teleprompters:** Optimizers that run your pipeline against a dataset and "compile" the perfect few-shot prompt for your specific model.
    `
  },
  {
    id: 'storage-parallel-filesystems',
    title: 'Storage: Lustre & WEKA',
    category: 'Infrastructure',
    subcategory: 'Storage',
    readTime: '15 min read',
    excerpt: 'Parallel file systems for high-throughput AI training.',
    date: '2024-11-25',
    tags: ['Storage', 'Lustre', 'WEKA'],
    content: `
# Feeding the Beast

GPUs need data faster than NFS can provide.
*   **Lustre:** Stripes files across thousands of disks.
*   **WEKA:** Software-defined storage that bypasses the kernel for NVMe speed.
*   **GPUDirect Storage:** DMA from SSD directly to GPU VRAM.
    `
  },
  {
    id: 'lora-peft-mathematics',
    title: 'LoRA & PEFT Mathematics',
    category: 'Software',
    subcategory: 'Training',
    readTime: '12 min read',
    excerpt: 'Low Rank Adaptation math explained. Fine-tuning with minimal compute.',
    date: '2024-12-08',
    tags: ['Math', 'Training'],
    content: `
# Efficient Fine-Tuning

$$W_{new} = W + BA$$
*   Updates only low-rank matrices A and B.
*   Reduces trainable parameters by 10,000x.
*   Allows fine-tuning 70B models on consumer GPUs.
    `
  },
  {
    id: 'evals-ragas-framework',
    title: 'RAGAS & Evals',
    category: 'Software',
    subcategory: 'Ops',
    readTime: '10 min read',
    excerpt: 'Unit testing for LLMs. Faithfulness, Answer Relevance, and Context Precision.',
    date: '2024-12-12',
    tags: ['Evals', 'Quality'],
    content: `
# LLM-as-a-Judge

Using GPT-4 to grade your local model.
*   **Faithfulness:** Did the model stick to the context?
*   **Relevance:** Did it answer the question?
*   **Precision:** Did retrieval find the right docs?
    `
  }
];

export const getArticlesByCategory = (): CategoryMap => {
  const map: CategoryMap = {};
  wikiContent.forEach(article => {
    if (!map[article.category]) {
      map[article.category] = [];
    }
    map[article.category].push(article);
  });
  return map;
};