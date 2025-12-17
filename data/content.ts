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
  {
    id: 'definitive-guide-ai-strategy',
    title: 'Building AI Infrastructure: The Definitive Strategy Guide',
    category: 'Getting Started',
    subcategory: 'Strategy',
    readTime: '30 min read',
    excerpt: 'A holistic framework for getting AI right. Balancing performance, cost, and scalability while avoiding vendor lock-in and Shadow AI.',
    date: '2024-12-20',
    tags: ['Strategy', 'Management', 'Enterprise', 'Guide'],
    content: `
# Getting AI Right: The Infrastructure Imperative

Infrastructure is destiny. In the AI era, your infrastructure choices dictate your model velocity, your unit economics, and ultimately, your competitive advantage. This guide consolidates the best practices for building a production-grade AI platform.

## 1. The Core Philosophy: "AI as a Workload, Not a Science Project"

Too many organizations treat AI as an R&D experiment. To get it right, you must treat it as a mission-critical workload with SLAs, SLOs, and rigorous CI/CD.

### The Four Pillars of AI Infra
1.  **Compute:** The raw horsepower (GPUs, TPUs, NPUs).
2.  **Data:** The fuel (Data Lakes, Vector Stores, Feature Stores).
3.  **Model:** The software artifact (Weights, Biases, Code).
4.  **Operationalization:** The delivery mechanism (Serving, Monitoring, Retraining).

## 2. Build vs. Buy: The Eternal Question

*   **Buy (API-First):** Start here. Using OpenAI or Anthropic APIs eliminates infrastructure headaches. However, as volume scales, costs scale linearly. There are no economies of scale.
*   **Build (Open Source/Self-Hosted):** Requires significant CapEx and OpEx. However, unit costs drop dramatically at scale. You own the IP, and you control data privacy.
    *   *Rule of Thumb:* If you spend >$500k/year on APIs, investigate self-hosting Llama 3 or Mistral.

## 3. The "AI Tax" and Cost Management

AI is expensive. "Getting it right" means optimizing TCO.
*   **Spot Instances:** Use spot instances for fault-tolerant training jobs (with checkpointing) to save 60-70%.
*   **Right-Sizing:** Don't put a 7B model on an H100. Use A10s or L4s for smaller inference tasks.
*   **Data Gravity:** Compute must move to data, not vice versa. Egress fees can kill your budget if you train in AWS using data stored in Azure.

## 4. The Trap of Vendor Lock-In

The cloud providers want you to use their proprietary stacks (SageMaker, Vertex AI). While convenient, they lock you into their ecosystem.
*   **The Kubernetes Abstraction:** By building on K8s, you commoditize the compute layer. You can lift and shift your training job from AWS to CoreWeave to on-prem with minimal code changes.
    `
  },
  {
    id: '5-step-guide-scalable-ai',
    title: 'A 5-Step Guide to Scalable AI Infrastructure',
    category: 'Infrastructure',
    subcategory: 'Storage & Data',
    readTime: '25 min read',
    excerpt: 'Optimizing the data path is critical for AI success. This 5-step framework covers eliminating I/O bottlenecks, GPU saturation, and data intelligence.',
    date: '2025-01-20',
    tags: ['Storage', 'Scalability', 'DataManagement', 'Guide'],
    content: `
# The Data Bottleneck in AI

While much attention is paid to GPU performance (FLOPS), the hidden bottleneck in most AI systems is **Storage I/O**. A $30,000 H100 GPU is worthless if it spends 40% of its time waiting for data. This guide outlines 5 steps to ensure your data infrastructure keeps pace with your compute.

## Step 1: Architect for GPU Saturation (Eliminate I/O Wait)

Traditional enterprise storage (NAS) was designed for human-speed access (Word docs, PDFs). AI requires machine-speed access.
*   **The Challenge:** Deep Learning training involves random read patterns on massive datasets (millions of small images). Standard NFS protocols introduce too much latency metadata overhead.
*   **The Solution:** Implement a high-performance **Parallel File System** (like Lustre, GPFS, or DDN Exascaler). Unlike NFS, which bottlenecks on a single head node, parallel file systems stripe data across hundreds of disks, allowing the GPU to read from all of them simultaneously.
*   **Goal:** Keep GPU utilization (volatile utility) above 90%.

## Step 2: Ensure Linear Scalability

In AI, your dataset will grow by 10x next year. Your storage performance must grow with it.
*   **Scale-Up vs. Scale-Out:** Avoid monolithic filers. Use a scale-out architecture where adding capacity (more drives) also adds performance (more controllers/bandwidth).
*   **Benchmarks:** Don't just test throughput (GB/s). Test **IOPS** (Operations Per Second) on small files (4KB - 128KB), which is the dominant pattern for computer vision training.

## Step 3: Optimize the Full Data Lifecycle

Not all data needs to be on NVMe flash.
*   **Hot Tier:** Training datasets currently in use. Must be on NVMe.
*   **Warm Tier:** Checkpoints and validation sets. High throughput HDD or QLC flash.
*   **Cold Tier:** Raw ingest data and archival models. Object Storage (S3).
*   **Automation:** Use automated policy engines to move data between tiers transparently. The data scientist should see a single namespace ("/data/dataset_a") regardless of where the bits physically sit.

## Step 4: Secure the Data Pipeline

AI infrastructure is often multi-tenant (Research, Engineering, Production).
*   **Multi-Tenancy:** Ensure strict isolation. A heavy training job from the Research team should not starve the bandwidth of the Production inference API.
*   **Encryption:** Implementation of encryption at rest and in flight (using GPU Direct Storage to decrypt on the NIC/GPU) to minimize CPU overhead.

## Step 5: Gain Data Intelligence (Visibility)

You cannot optimize what you cannot measure.
*   **I/O Profiling:** Monitor which jobs are I/O bound vs Compute bound.
*   **Pattern Recognition:** Identify "read-heavy" vs "write-heavy" (checkpointing) phases of the training loop.
*   **Optimization:** Use this intelligence to pre-fetch data into the GPU memory or local NVMe cache before the training step requests it.

### Conclusion
Building scalable AI infrastructure is about balancing the equation: **Compute Speed = Data Delivery Speed**. If data delivery lags, you are paying for idle silicon.
    `
  },
  {
    id: 'k8s-ai-operating-system',
    title: 'Why Kubernetes is the Operating System for AI',
    category: 'Software',
    subcategory: 'Orchestration',
    readTime: '18 min read',
    excerpt: 'Kubernetes has won the war for AI orchestration. Understanding Operators, CRDs, and how K8s abstracts the GPU layer.',
    date: '2024-11-15',
    tags: ['Kubernetes', 'Architecture', 'K8s'],
    content: `
# The Universal Compute Plane

Just as Linux became the OS for the server, Kubernetes (K8s) has become the OS for the data center. For AI, it provides the critical abstraction layer between your code and the metal.

## 1. Declarative Infrastructure

In AI, you don't want to manually provision servers. You want to declare: *"I need 64 GPUs with 80GB VRAM connected via Infiniband."*
K8s makes this possible via **Custom Resource Definitions (CRDs)**.
*   **RayJob:** Defines a distributed Ray cluster.
*   **TFJob / PyTorchJob:** Defines distributed training sets.

## 2. The Operator Pattern

K8s Operators automate the human operational knowledge.
*   **NVIDIA GPU Operator:** Automatically installs drivers, the container toolkit, and monitoring exporters on any node that joins the cluster.
*   **Vector DB Operators:** Manage the sharding and replication of Milvus or Weaviate databases.

## 3. Resource Scheduling & Bin Packing

AI jobs are "gang scheduled"—they need all resources at once. K8s schedulers (like Volcano or Kueue) ensure that high-priority training runs preempt low-priority research jobs, maximizing cluster utilization (MFU).

## 4. Portability

A K8s manifest runs the same on AWS EKS, Google GKE, or a bare-metal rack in your basement. This portability is the only hedge against rising cloud GPU prices.
    `
  },
  {
    id: 'hybrid-cloud-ai-patterns',
    title: 'Hybrid Cloud AI: Bursting to the Cloud',
    category: 'Infrastructure',
    subcategory: 'Strategy',
    readTime: '20 min read',
    excerpt: 'The economics of hybrid AI. Running steady-state inference on-prem while bursting training jobs to the public cloud.',
    date: '2025-01-05',
    tags: ['Hybrid', 'Cloud', 'Cost', 'Architecture'],
    content: `
# Balancing CapEx and OpEx

The "All-In on Cloud" strategy is failing for large-scale AI. The "All-In On-Prem" strategy is too slow. The answer is Hybrid.

## Pattern 1: Training in Cloud, Inference On-Prem

*   **Training:** Requires massive bursts of compute (thousands of GPUs) for a short time (weeks). Cloud is perfect for this elasticity.
*   **Inference:** Requires steady-state, 24/7 availability. Cloud rental fees (OpEx) accumulate forever. Buying hardware (CapEx) amortizes over 3-5 years, offering 5-10x cost savings.

## Pattern 2: Data Sovereignty (The reverse)

For industries like Healthcare and Finance, data cannot leave the building.
*   **Fine-Tuning:** Happens on-prem on secure, air-gapped clusters.
*   **General Purpose:** Non-sensitive workloads use public APIs.

## The Technical Enablers

1.  **Unified Control Plane:** Using tools like Rancher or Anthos to manage on-prem and cloud K8s clusters from a single pane of glass.
2.  **Global Namespace Storage:** Technologies like **HammerSpace** or **WEKA** that present a single file system view across locations. Data is cached locally where the compute is running.
    `
  },
  {
    id: 'mlops-production-pipelines',
    title: 'The MLOps Lifecycle: Productionizing Research',
    category: 'Software',
    subcategory: 'MLOps',
    readTime: '22 min read',
    excerpt: 'Moving from "it works on my laptop" to production. Feature stores, model registries, and continuous training pipelines.',
    date: '2025-01-10',
    tags: ['MLOps', 'DevOps', 'Pipelines'],
    content: `
# Bridging the Gap

Data Scientists work in Notebooks. Engineers work in IDEs. MLOps bridges this chasm.

## 1. The Feature Store (Feast / Tecton)

*   **Problem:** Training uses a CSV dump from last month. Inference uses live data. This causes "Training-Serving Skew".
*   **Solution:** A Feature Store provides a consistent source of truth. It serves batch features for training and low-latency KV lookups for inference.

## 2. The Model Registry (MLflow)

A model is not just a file. It is a versioned artifact with metadata.
*   **Lineage:** Which dataset trained this model? Which code commit?
*   **Staging:** Promoting models from \`Staging\` to \`Production\` only after passing automated eval gates.

## 3. Continuous Training (CT)

Models rot. Data distributions shift.
*   **Drift Detection:** Monitoring the statistical properties of inputs. If the input distribution shifts (Concept Drift), a webhook triggers a re-training pipeline automatically.

## 4. Serving Infrastructure

*   **Canary Deployments:** Rolling out a new model to 1% of traffic to check latency and error rates before full release.
*   **Shadow Mode:** Running the new model in parallel with the old one, but not returning its results to the user. Used to verify accuracy safely.
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
*   **Singularity (Apptainer):** Runs containers as a standard user. Encapsulates the environment in a single file (\`.sif\`).
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
  },
  
  // --- USE CASES ---
  {
    id: 'use-case-enterprise-rag',
    title: 'Enterprise Search: The Knowledge Engine',
    category: 'Use Cases',
    subcategory: 'Knowledge Management',
    readTime: '25 min read',
    excerpt: 'Architecting a RAG system for 10M+ documents. Handling ACLs, citations, and multi-hop reasoning across PDFs, SharePoint, and Jira.',
    date: '2025-02-10',
    tags: ['RAG', 'Enterprise', 'Architecture'],
    content: `
# Connecting the Corporate Brain

Building a "ChatGPT for your data" is easy to demo but hard to productionize.

## 1. The Ingestion Pipeline
Garbage in, Garbage out. The challenge isn't the LLM, it's parsing 10 years of messy PDFs.
*   **Unstructured.io:** Using vision models to detect tables, headers, and footers in PDFs before chunking.
*   **Recursive Chunking:** Splitting text intelligently (by paragraph) rather than by fixed character counts to preserve semantic context.

## 2. Advanced Indexing
*   **Hybrid Search:** Combining **BM25** (keyword matching for specific part numbers) with **Cosine Similarity** (semantic understanding).
*   **Reranking:** The vector DB returns 50 results. A Cross-Encoder model (like BGE-Reranker-v2) re-scores them to find the top 5 most relevant. This improves accuracy by ~15%.

## 3. Security (ACLs)
You cannot simply dump everything into one index.
*   **Document Level Security:** We embed Access Control Lists (Active Directory Groups) directly into the vector metadata.
*   **Filtering:** Queries are pre-filtered: \`SELECT * FROM vectors WHERE user_group IN ('Engineering', 'All_Staff')\`.
    `
  },
  {
    id: 'use-case-customer-support-agents',
    title: 'Autonomous Support: Replacing Tier 1',
    category: 'Use Cases',
    subcategory: 'Customer Experience',
    readTime: '20 min read',
    excerpt: 'Designing agents that can take action. API integration for refunds, order tracking, and identity verification without human intervention.',
    date: '2025-02-12',
    tags: ['Agents', 'CustomerSupport', 'Automation'],
    content: `
# Beyond the Chatbot

Old chatbots followed a decision tree. New agents use reasoning.

## 1. Tool Use (Function Calling)
The model is given a set of APIs defined in JSON schema.
*   \`check_order_status(order_id)\`
*   \`process_refund(order_id, reason)\`
The model decides *which* tool to call based on the user's intent.

## 2. The Routing Layer
Not every query needs GPT-4.
*   **Semantic Router:** A small BERT model classifies the intent.
    *   "Where is my stuff?" -> Route to Llama-3-8B + Order API.
    *   "I want to sue you." -> Route to Human Agent immediately.

## 3. Latency Optimization
Users hate waiting.
*   **Speculative Decoding:** Used to generate empathetic filler text ("I understand you're frustrated, let me check that...") while the slow API call runs in the background.
    `
  },
  {
    id: 'use-case-legal-contract-review',
    title: 'Legal Tech: Automated Contract Analysis',
    category: 'Use Cases',
    subcategory: 'Legal',
    readTime: '18 min read',
    excerpt: 'Semantic analysis of NDAs and MSAs. Redlining, risk scoring, and clause comparison using long-context LLMs.',
    date: '2025-02-15',
    tags: ['Legal', 'NLP', 'Risk'],
    content: `
# The 100-Page Document

Legal contracts require massive context windows and perfect recall.

## 1. Clause Extraction
Instead of treating the document as one blob, we segment it into functional blocks: "Indemnity", "Termination", "Jurisdiction".
*   **Technique:** We fine-tuned a DeBERTa model to classify paragraphs into legal categories.

## 2. Risk Scoring (Playbooks)
The system compares incoming contracts against a company "Playbook".
*   *Rule:* "Liability cap must not exceed 2x fees."
*   *Action:* The Agent extracts the liability clause, extracts the fee value, performs math, and flags violations.

## 3. Automated Redlining
Using models like **Claude 3 Opus** (due to high reasoning capability), we generate suggested redlines in track-changes format to align the contract with company policy.
    `
  },
  {
    id: 'use-case-fintech-fraud',
    title: 'FinTech: Real-Time Transaction Monitoring',
    category: 'Use Cases',
    subcategory: 'Finance',
    readTime: '22 min read',
    excerpt: 'Moving from rules-based engines to Graph Neural Networks and LLMs for detecting money laundering rings in milliseconds.',
    date: '2025-02-18',
    tags: ['Finance', 'Fraud', 'RealTime'],
    content: `
# Catching the Ring

Traditional fraud detection uses rules: \`if amount > $10,000\`.
Modern fraud uses **Graph Neural Networks (GNNs)**.

## 1. The Graph Topology
We model data as a graph:
*   **Nodes:** Users, Credit Cards, IP Addresses, Device IDs.
*   **Edges:** Transactions, Logins, Shared Attributes.
A GNN (like GraphSAGE) can detect "Money Laundering Rings" where funds cycle through 50 accounts in minutes—a pattern invisible to tabular models.

## 2. LLM Explainability
The GNN outputs a score (0.99 Fraud). The human analyst asks "Why?".
*   **Solution:** We feed the subgraph neighbors into an LLM.
*   **Output:** "High risk because User A shares a Device ID with User B, who was previously banned for chargeback fraud."

## 3. Low Latency Inference
Inference must happen in <20ms (during the card swipe).
*   **Feature Store:** Pre-computed graph embeddings are stored in Redis/Cassandra for instant lookup.
    `
  },
  {
    id: 'use-case-legacy-migration',
    title: 'App Modernization: COBOL to Java',
    category: 'Use Cases',
    subcategory: 'Software Engineering',
    readTime: '24 min read',
    excerpt: 'Using LLMs to decompose monolithic mainframes. Test generation, transpilation, and business logic extraction patterns.',
    date: '2025-02-20',
    tags: ['Migration', 'COBOL', 'Engineering'],
    content: `
# De-risking the Monolith

Banks run on COBOL. The developers are retiring.

## 1. The "Reasoning" Transpiler
Direct regex translation fails. We use a multi-step chain:
1.  **Explain:** LLM reads COBOL and writes a functional spec in English.
2.  **Test:** LLM generates unit tests (Input/Output pairs) based on the COBOL logic.
3.  **Code:** LLM writes Java/Go code to match the spec.
4.  **Verify:** The new code is run against the generated tests.

## 2. Database De-coupling
*   **Problem:** Stored Procedures with 5,000 lines of logic.
*   **Solution:** Agents trace data lineage to separate "Business Logic" from "Data Access", moving the logic into the application layer.

## 3. Human in the Loop
The AI doesn't commit code. It opens a Pull Request. It generates a "Migration Report" highlighting ambiguous logic (e.g., GOTO statements) for human review.
    `
  },
  {
    id: 'use-case-predictive-maintenance',
    title: 'Manufacturing: Visual QC & Predictive Maintenance',
    category: 'Use Cases',
    subcategory: 'Industrial',
    readTime: '16 min read',
    excerpt: 'Deploying Vision Transformers (ViT) to the edge. Detecting defects in assembly lines and predicting equipment failure using audio/vibration data.',
    date: '2025-02-22',
    tags: ['Manufacturing', 'Edge', 'Vision'],
    content: `
# AI on the Factory Floor

Cloud connectivity is spotty. Latency must be real-time.

## 1. Visual Quality Control
*   **Model:** YOLOv8 or EfficientNet fine-tuned on defect images.
*   **Deployment:** Compiled to **TensorRT** and deployed on **NVIDIA Jetson** edge devices.
*   **Task:** Cameras inspect PCBs at 60 FPS. If a scratch is detected, a pneumatic arm kicks the part off the line.

## 2. Audio Anomaly Detection
Motors sound different before they break.
*   **Sensor:** Piezoelectric vibration sensors + Microphones.
*   **Technique:** Spectrogram analysis. We convert audio to images (spectrograms) and use Vision models to detect "abnormal" frequency bands indicating bearing wear.

## 3. Digital Twins
We feed real-time sensor data into a physics-based simulation (Digital Twin). An AI compares the *actual* temperature vs the *predicted* temperature. Divergence indicates a sensor fault or cooling failure.
    `
  },
  {
    id: 'use-case-drug-discovery',
    title: 'Life Sciences: Generative Protein Design',
    category: 'Use Cases',
    subcategory: 'Healthcare',
    readTime: '28 min read',
    excerpt: 'Accelerating the wet lab loop. Using AlphaFold, DiffDock, and generative chemistry to propose novel drug candidates.',
    date: '2025-02-25',
    tags: ['BioTech', 'DrugDiscovery', 'AlphaFold'],
    content: `
# Generative Biology

Biology is becoming an engineering discipline.

## 1. Structure Prediction (AlphaFold)
Predicting the 3D shape of a protein from its 1D amino acid sequence.
*   **Infrastructure:** Massive inference pipelines running on A100s.
*   **Goal:** Identifying binding pockets on the protein surface (targets for drugs).

## 2. Molecular Docking (DiffDock)
Simulating how a small molecule (drug) fits into the protein's binding pocket.
*   **Traditional:** Physics-based simulation (slow).
*   **AI:** Diffusion models (DiffDock) predict the orientation in seconds.

## 3. De Novo Design
Instead of screening existing libraries, we use Generative Models to *hallucinate* new molecules that have high affinity for the target but low toxicity.
*   **Reinforcement Learning:** The model is rewarded for optimizing properties (Solubility, Permeability, Affinity).
    `
  },

  // --- ENGINEERING BLOG POSTS ---
  {
    id: 'blog-migrating-aws-bare-metal',
    title: 'Saving 60% by Moving from AWS to Bare Metal',
    category: 'Blog',
    readTime: '20 min read',
    excerpt: 'The cloud premium is real. How we migrated a 500-GPU training cluster from EC2 to bare metal CoreWeave nodes, and the networking challenges we faced.',
    date: '2025-01-15',
    tags: ['Migration', 'Cost Optimization', 'AWS', 'CoreWeave'],
    content: `
# The Cloud Premium

When you're small, AWS is perfect. You click a button, you get a GPU. But when you hit 500 H100s, the "convenience tax" becomes a multi-million dollar line item.

We recently completed a migration of our core training workload from **AWS p5.48xlarge** instances to a **Bare Metal provider** (CoreWeave/Lambda style).

### The Economics
*   **AWS On-Demand:** ~$98/hr per H100 node (8 GPUs).
*   **Reserved Instances (1yr):** ~$60/hr.
*   **Bare Metal Contract:** ~$35/hr.

For a 64-node cluster (512 GPUs), that's a difference of **$11M per year**.

### The Challenges
It wasn't just copy-paste.
1.  **Networking:** We lost the AWS VPC/Security Group abstraction. We had to manage BGP routes and configure our own firewall rules on the ToR (Top of Rack) switches.
2.  **Storage:** S3 is magical. We replaced it with a self-hosted **MinIO** cluster backed by 2PB of NVMe, but tuning the erasure coding for throughput took weeks.
3.  **Instance Stability:** On AWS, if a node dies, you get a new one instantly. On bare metal, you wait for a technician to replace the DIMM. We had to rewrite our training loops to be much more fault-tolerant.
    `
  },
  {
    id: 'blog-debugging-nccl',
    title: 'Debugging NCCL Hangs: A War Story',
    category: 'Blog',
    readTime: '15 min read',
    excerpt: 'The training run stalled at iteration 4000. No error logs. No tracebacks. Just silence. Here is how we debugged a frozen 256-GPU cluster.',
    date: '2025-01-08',
    tags: ['Debugging', 'NCCL', 'Distributed Training'],
    content: `
# The Silent Killer

There is nothing scarier in ML Engineering than a training run that just... stops. GPU utilization drops to 0%, but the process doesn't exit.

### The Suspect: NCCL
NCCL (NVIDIA Collective Communications Library) is responsible for syncing gradients. If one GPU fails to send its handshake, the other 255 GPUs wait forever.

### The Investigation
1.  **NCCL_DEBUG=INFO**: We turned on logging. Nothing obvious.
2.  **PyTorch Profiler:** Showed we were stuck in \`all_reduce\`.
3.  **GDB:** We attached GDB to a running process. It was stuck in a CUDA kernel wait.

### The Root Cause
It wasn't software. It was a **loose QSFP cable** on Node 14. The cable was connected enough to show "Link Up" but had high bit-error rates (BER). Packets were being dropped, re-transmitted, and dropped again, causing a "soft hang."

### The Fix
We deployed a daemon that continuously monitors \`ethtool -S | grep error\`. If any link sees error counts rising, we automatically cordon the node and restart the job.
    `
  },
  {
    id: 'blog-optimizing-vllm',
    title: 'Optimizing vLLM Throughput for Production',
    category: 'Blog',
    readTime: '18 min read',
    excerpt: 'Continuous batching is not enough. How we tuned block sizes, KV-cache allocation, and max-num-seqs to squeeze 2000 tokens/sec out of a single A100.',
    date: '2024-12-20',
    tags: ['vLLM', 'Inference', 'Performance'],
    content: `
# Beyond Out-of-the-Box

vLLM is fast by default, but production workloads require tuning. We increased our throughput by 40% with three changes.

### 1. Block Size Matters
The default block size is 16. We found that for our prompt length distribution (long context, short answer), a **block size of 32** reduced memory fragmentation and improved cache hits.

### 2. GPU Memory Utilization
We bumped \`gpu_memory_utilization\` from 0.90 to 0.98. This sounds dangerous, but since our model weights are static and we don't use beam search, we could safely allocate more VRAM to the KV cache, allowing larger batch sizes.

### 3. Prefix Caching
We enabled \`enable_prefix_caching\`. Our users often ask follow-up questions with the same system prompt and document context. vLLM now reuses the KV cache for the shared prefix, reducing TTFT (Time To First Token) from 200ms to 40ms.
    `
  },
  {
    id: 'blog-liquid-cooling-leaks',
    title: 'Disaster Recovery: When Liquid Cooling Leaks',
    category: 'Blog',
    readTime: '12 min read',
    excerpt: 'What happens when a coolant hose bursts inside a $2M compute rack? Our post-mortem on a Direct Liquid Cooling failure.',
    date: '2024-12-15',
    tags: ['Hardware', 'Cooling', 'Post-Mortem'],
    content: `
# The Pink Puddle

We use Direct Liquid Cooling (DLC) with a propylene glycol mix (colored pink). Last Tuesday, the leak detection tape triggered an alarm in Row 4.

### The Failure
A Quick Disconnect (QD) coupling had not been fully seated during maintenance. Under pressure, the O-ring failed.

### The Damage
Gravity is the enemy. The leak happened on the top U (Unit 42). Coolant dripped down through 3 other servers.
*   **Survivors:** The motherboards were conformal coated (water-resistant). We washed them with isopropyl alcohol, and they booted!
*   **Casualties:** The Power Supply Units (PSUs) were not coated. Two of them shorted immediately.

### Lessons Learned
1.  **Drip Pans:** We installed drip pans between every 10U block.
2.  **Negative Pressure:** We switched our CDU (Coolant Distribution Unit) to negative pressure. In a leak, air gets sucked *in* rather than water spraying *out*.
    `
  },
  {
    id: 'blog-rust-for-ai-infra',
    title: 'Why We Rewrote Our Sidecars in Rust',
    category: 'Blog',
    readTime: '14 min read',
    excerpt: 'Python was eating 20% of our CPU just for logging. Moving our sidecar agents to Rust reduced overhead to <1%.',
    date: '2024-12-05',
    tags: ['Rust', 'Performance', 'Infrastructure'],
    content: `
# The Python Tax

In our Kubernetes clusters, every pod runs a "sidecar" container responsible for:
1.  Shipping logs to Splunk.
2.  Pulling secrets from Vault.
3.  Reporting heartbeats.

Our Python sidecar consumed ~1 core and 500MB RAM. Multiplied by 5,000 pods, we were wasting **5,000 CPU cores** just on plumbing.

### Enter Rust
We rewrote the agent in Rust using \`tokio\`.
*   **Binary Size:** 300MB (Python) -> 15MB (Rust).
*   **Memory:** 500MB -> 12MB.
*   **CPU:** 1 Core -> 0.05 Cores.

The migration saved us an estimated **$40k/month** in compute costs, proving that high-level languages in the infra layer have a hidden cost.
    `
  },
  {
    id: 'blog-gpu-kernel-development',
    title: 'Writing Custom Kernels: An Intro to Triton DSL',
    category: 'Blog',
    readTime: '22 min read',
    excerpt: 'You do not need to know CUDA C++ to make PyTorch go fast. A tutorial on writing a fused Softmax kernel in OpenAI Triton.',
    date: '2024-11-28',
    tags: ['Triton', 'CUDA', 'Optimization'],
    content: `
# The Gap Between Python and CUDA

PyTorch is easy, but slow (memory bound). CUDA is fast, but hard (C++, pointers, manual memory management).
**Triton** fills the gap. It allows you to write Python-like code that compiles to efficient PTX.

### The Problem: Softmax
Standard Softmax requires:
1.  Read row ($O(N)$)
2.  Find Max ($O(N)$)
3.  Subtract Max & Exp ($O(N)$)
4.  Sum ($O(N)$)
5.  Divide ($O(N)$)
6.  Write ($O(N)$)

That is 6 memory passes.

### The Triton Solution
In Triton, we load the row into SRAM *once*, perform all math in registers, and write back *once*.

\`\`\`python
@triton.jit
def softmax_kernel(output_ptr, input_ptr, stride, n_cols, BLOCK_SIZE: tl.constexpr):
    # Load data into SRAM
    row_idx = tl.program_id(0)
    offsets = row_idx * stride + tl.arange(0, BLOCK_SIZE)
    x = tl.load(input_ptr + offsets, mask=offsets < n_cols, other=-float('inf'))
    
    # Math in Registers
    x_max = tl.max(x, axis=0)
    numerator = tl.exp(x - x_max)
    denominator = tl.sum(numerator, axis=0)
    output = numerator / denominator
    
    # Write Back
    tl.store(output_ptr + offsets, output, mask=offsets < n_cols)
\`\`\`
    `
  },
  {
    id: 'blog-cost-of-training-llama3',
    title: 'The Real Cost of Training Llama 3',
    category: 'Blog',
    readTime: '16 min read',
    excerpt: 'It is not just GPU hours. We break down the hidden costs of data egress, storage IOPS, and checkpoint retention.',
    date: '2024-11-15',
    tags: ['Cost', 'Llama 3', 'Training'],
    content: `
# The GPU Bill is Only 60%

We modeled the cost of training a 70B parameter model from scratch.
*   **Compute:** $2.5M.
*   **Data Egress:** $400k. (Pulling CommonCrawl from S3 to a different region).
*   **Checkpoint Storage:** $300k. We saved a 500GB checkpoint every 1000 steps. We forgot to set a lifecycle policy to delete old ones. By the end, we had petabytes of stale checkpoints.
*   **DevOps Time:** $200k. Two engineers full-time for 3 months keeping the cluster alive.
    `
  },
  {
    id: 'blog-kubernetes-vs-slurm',
    title: 'Kubernetes vs Slurm: The Internal Debate',
    category: 'Blog',
    readTime: '18 min read',
    excerpt: 'Our Research team wanted Slurm. Our Platform team wanted Kubernetes. Here is how we compromised with Volcano Scheduler.',
    date: '2024-11-10',
    tags: ['Kubernetes', 'Slurm', 'Platform'],
    content: `
# The Culture Clash

*   **Researchers:** "I just want to run \`sbatch script.sh\`. I don't want to write a 50-line YAML file."
*   **Platform:** "We need K8s for observability, sidecars, and integration with our CI/CD."

### The Compromise
We built a CLI tool that looks like Slurm (\`job submit\`) but generates K8s CRDs under the hood. We used **Volcano Scheduler** to add "Gang Scheduling" (all-or-nothing pod creation) to Kubernetes, satisfying the distributed training requirement.
    `
  },
  {
    id: 'blog-storage-patterns',
    title: 'High Performance Storage Patterns for Multi-Modal AI',
    category: 'Blog',
    readTime: '15 min read',
    excerpt: 'Training on images and video kills standard NFS. How we used WebDataset and local NVMe caching to saturate GPU bandwidth.',
    date: '2024-10-28',
    tags: ['Storage', 'Data Loading', 'Performance'],
    content: `
# Small Files Problem

A file system hates 1 billion 50KB JPEG images. The metadata overhead (opening/closing file handles) becomes the bottleneck.

### Solution 1: Tarballs (WebDataset)
We packed images into 1GB tar files. The dataloader reads the tar stream sequentially. This changed our read pattern from "Random Small IO" to "Sequential Large IO", which disks love.

### Solution 2: Local Caching
We implemented a tiered cache.
1.  S3 (Source of Truth)
2.  Alluxio (Distributed Cache)
3.  Local NVMe (Ephemeral Node Storage)

The first epoch is slow (cache warming). Subsequent epochs run at PCIe speeds.
    `
  },
  {
    id: 'blog-observability-gpu',
    title: 'Observability for 10k GPUs',
    category: 'Blog',
    readTime: '14 min read',
    excerpt: 'Prometheus struggled with the cardinality. How we moved to VictoriaMetrics to track per-SM metrics across the fleet.',
    date: '2024-10-15',
    tags: ['Observability', 'Prometheus', 'Ops'],
    content: `
# The Cardinality Explosion

We wanted to track \`sm_efficiency\` for *every* GPU process.
\`metric{host="node-1", gpu="0", pid="1234", user="alice"}\`

With 10,000 GPUs and processes constantly starting/stopping, our Prometheus TSDB exploded. Queries took 2 minutes.

### The Fix
1.  **VictoriaMetrics:** We migrated to VM for better high-cardinality performance.
2.  **Aggregation:** We stopped recording per-process metrics in the long-term store. We aggregate to per-node metrics, and only enable per-process high-fidelity debugging on-demand.
    `
  },
  {
    id: 'blog-agent-orchestration',
    title: 'Orchestrating 1000 Agents: Production Patterns',
    category: 'Blog',
    readTime: '16 min read',
    excerpt: 'Agents getting stuck in loops? Context windows overflowing? Patterns for reliable autonomous swarms.',
    date: '2024-10-05',
    tags: ['Agents', 'Architecture', 'GenAI'],
    content: `
# The Infinite Loop

We deployed a "Research Agent" that could search the web. It got stuck searching for the same term, reading the same page, and summarizing it forever.

### Pattern 1: The Supervisor
We introduced a "Manager Agent" that strictly monitors the sub-agent's logs. If the sub-agent repeats an action 3 times, the Manager kills it and rewrites the prompt.

### Pattern 2: Tool Constraints
We removed the "general python executor" tool. It was too dangerous/flaky. We replaced it with strict, typed functions: \`search_google(query: str)\`, \`scrape_url(url: str)\`. Reliability went up 10x.
    `
  },
  {
    id: 'blog-security-model-weights',
    title: 'Securing Model Weights: The $100M File',
    category: 'Blog',
    readTime: '12 min read',
    excerpt: 'How we prevent exfiltration. Signed URLs, VPC Endpoints, and mTLS for inference services.',
    date: '2024-09-25',
    tags: ['Security', 'DevSecOps', 'Models'],
    content: `
# DLP (Data Loss Prevention) for Weights

Your model checkpoint is your IP.
1.  **VPC Endpoints:** Our S3 buckets are not accessible over the public internet. Access is only allowed from specific VPC IDs.
2.  **Presigned URLs:** Developers never get AWS Keys. They get a temporary URL that expires in 15 minutes to download a specific checkpoint.
3.  **Watermarking:** We embed subtle noise patterns in the weights. If the model leaks to HuggingFace, we can mathematically prove it was ours.
    `
  },
  {
    id: 'blog-energy-efficiency',
    title: 'Undervolting for Profit: Green AI',
    category: 'Blog',
    readTime: '15 min read',
    excerpt: 'We capped our H100s at 600W instead of 700W. Performance dropped 2%, but energy costs dropped 15%.',
    date: '2024-09-12',
    tags: ['Sustainability', 'Hardware', 'Optimization'],
    content: `
# The Power Curve

Semiconductors are not linear. The last 10% of performance requires 30% more power (and heat).

### The Experiment
We ran \`nvidia-smi -pl 600\` (Power Limit) on our training cluster.
*   **Throughput:** dropped from 310 TFLOPS to 304 TFLOPS. (-2%)
*   **Power:** dropped from 700W to 600W. (-14%)
*   **Thermals:** Fans spun down, saving another 50W per chassis.

For a long training run, the slight increase in time was paid for by the massive electricity savings.
    `
  },
  {
    id: 'blog-hiring-ml-infra',
    title: 'Hiring for ML Infrastructure: What We Look For',
    category: 'Blog',
    readTime: '14 min read',
    excerpt: 'We do not care if you know how Transformer Attention works. We care if you know what a File Descriptor is.',
    date: '2024-09-01',
    tags: ['Career', 'Hiring', 'Culture'],
    content: `
# The Skill Gap

We see thousands of resumes from "Prompt Engineers". We see very few from people who understand Linux internals.

### The Interview Question
*"A GPU is stuck in D-state (Uninterruptible Sleep). How do you debug it?"*

We look for candidates who understand:
1.  Kernel drivers.
2.  PCIe bus errors.
3.  The difference between user-space CUDA and kernel-space drivers.

The best ML Infra engineers are usually SysAdmins who learned Python, not Data Scientists who learned Docker.
    `
  },
  {
    id: 'blog-future-of-transformer',
    title: 'Is the Transformer Architecture Peaking?',
    category: 'Blog',
    readTime: '20 min read',
    excerpt: 'SSMs, Mamba, and RWKV. Looking at the linear-attention contenders that might replace the Quadratic Bottleneck.',
    date: '2024-08-20',
    tags: ['Research', 'Architecture', 'Future'],
    content: `
# The Quadratic Wall

Attention is $O(N^2)$. As context length grows (1M tokens), compute grows exponentially.
**Mamba (SSM)** offers $O(N)$ inference (Linear). It acts like an RNN, compressing history into a fixed state.

### Why haven't they won yet?
1.  **In-Context Learning:** Transformers are surprisingly good at "recall" from anywhere in the context. SSMs struggle slightly with perfect recall over long distances.
2.  **Hardware Lottery:** TPUs and GPUs have 7 years of optimization for MatMul (Transformers). SSMs rely on "Prefix Scans" which are not yet hardware accelerated to the same degree.
    `
  },
  {
    id: 'blog-gpu-utilization-debugging',
    title: 'The Case of the 30% MFU: Debugging GPU Utilization',
    category: 'Blog',
    readTime: '25 min read',
    excerpt: 'Our H100s were idle 70% of the time. We deep dive into Nsight Systems profiling, kernel launch latency, and CPU bottlenecks.',
    date: '2025-01-22',
    tags: ['Performance', 'Debugging', 'Nsight'],
    content: `
# Buying Ferraris to Drive in a School Zone

We spent millions on H100s, but our Model Flops Utilization (MFU) was sitting at 30%. This is effectively lighting money on fire.

### The Investigation: Nsight Systems
We used \`nsys profile\` to visualize the timeline. The findings were shocking:
1.  **Kernel Launch Latency:** We were launching thousands of tiny CUDA kernels (element-wise operations). The overhead of telling the GPU what to do took longer than doing it.
    *   *Fix:* We used **Torch.compile** to fuse these kernels into single, larger operations.
2.  **CPU Bottleneck:** The CPU couldn't feed data fast enough. The GPU was waiting for the next batch.
    *   *Fix:* We moved preprocessing (image resizing/normalization) to DALI (Data Loading Library) to run it on the GPU, freeing up the CPU.

### The Result
After kernel fusion and dataloader optimization, MFU jumped to 58%, effectively doubling our cluster size for free.
    `
  },
  {
    id: 'blog-networking-rail-optimization',
    title: 'Rail-Optimized Networking for H100 Clusters',
    category: 'Blog',
    readTime: '28 min read',
    excerpt: 'Why standard CLOS topologies fail for AI. Explaining Rail-Optimization, sharp reductions, and avoiding QPI traversal.',
    date: '2025-01-25',
    tags: ['Networking', 'Architecture', 'Infiniband'],
    content: `
# Physics of the Switch

In a standard data center, any server can talk to any server. In AI training, traffic patterns are highly predictable.

### The Rail Concept
An H100 server has 8 GPUs. Each GPU has its own 400Gb Network Interface Card (NIC).
Instead of connecting all 8 NICs to the same Top-of-Rack (ToR) switch, we connect:
*   GPU 0 from *every* server to Switch A (Rail 1).
*   GPU 1 from *every* server to Switch B (Rail 2).
*   ...up to Rail 8.

### Why?
1.  **No QPI/UPI Traversal:** Traffic from GPU 0 never needs to cross the CPU interconnect to get to the NIC. It has a direct PCIe path.
2.  **Congestion Isolation:** If Rail 1 is congested, it doesn't affect the All-Reduce happening on Rail 2.
3.  **Perfect Load Balancing:** Deep learning collectives (All-Reduce) naturally align with this physical topology.
    `
  },
  {
    id: 'blog-storage-lustre-tuning',
    title: 'Tuning Lustre for Billion-Scale Image Datasets',
    category: 'Blog',
    readTime: '20 min read',
    excerpt: 'Default Lustre settings will crash under AI workloads. We discuss stripe counts, OST balancing, and client-side caching.',
    date: '2025-01-28',
    tags: ['Storage', 'Lustre', 'HPC'],
    content: `
# The Metadata Hammer

We have a dataset with 2 Billion images. \`ls -l\` takes 4 hours.

### Optimization 1: Directory Striping (DNE)
Standard Lustre puts all metadata on one MDT (Metadata Target). We enabled **Distributed Namespace (DNE)** to stripe directory metadata across 4 MDTs. Now \`ls\` is parallelized.

### Optimization 2: File Striping
For large checkpoints (100GB+), we set the stripe count to -1 (stripe across all OSTs). This allows us to write to 100 hard drives simultaneously, achieving 50 GB/s write speeds for a single file.

### Optimization 3: Client Read-Ahead
We tuned \`max_read_ahead_mb\` to match our training batch size. If the model asks for 1MB, Lustre pre-fetches the next 64MB, anticipating the sequential read pattern of the tarball.
    `
  },
  {
    id: 'blog-inference-speculative-decoding',
    title: 'Speculative Decoding: Free Latency',
    category: 'Blog',
    readTime: '18 min read',
    excerpt: 'How we reduced latency by 2x without changing the model. Using draft models and speculative verification.',
    date: '2025-02-02',
    tags: ['Inference', 'Optimization', 'Algorithms'],
    content: `
# Guessing the Future

LLMs are memory bound. Generating one token takes the same amount of time as checking 5 tokens.

### The Trick
We run a tiny "Draft Model" (e.g., Llama-7B) alongside our "Oracle Model" (Llama-70B).
1.  The Draft Model quickly guesses the next 5 tokens.
2.  The Oracle Model runs *once* in parallel to verify all 5 guesses.
3.  If the guesses are right, we just generated 5 tokens for the cost of 1.

### Implementation
We deployed this using vLLM's speculative decoding. We achieved a **2.3x speedup** on code generation tasks, where tokens are highly predictable (e.g., repeating indentation or closing brackets).
    `
  },
  {
    id: 'blog-energy-heat-reuse',
    title: 'Heating Our Office with Llama 3 Training Runs',
    category: 'Blog',
    readTime: '15 min read',
    excerpt: 'Sustainability is not just buying carbon credits. How we plumbed our DLC loops into the building\'s heating system.',
    date: '2025-02-05',
    tags: ['Sustainability', 'Hardware', 'Cooling'],
    content: `
# Computing as a Heater

A GPU is essentially a resistor that does math. 100% of the electricity becomes heat.
Our H100 cluster outputs 200kW of heat.

### The Loop
1.  **Primary Loop:** Water touches the GPU cold plates, heating up to 45°C.
2.  **Heat Exchanger:** Transfers heat to the building's secondary loop.
3.  **District Heating:** The warm water is pumped into the office floor radiators.

### The Economics
We saved **$15,000/month** in natural gas bills during winter. Effectively, the "cooling cost" of the cluster became negative—it became a revenue-generating asset for facilities management.
    `
  },
  {
    id: 'blog-cicd-ml-pipeline',
    title: 'CI/CD for LLMs: Testing Perplexity on Every Commit',
    category: 'Blog',
    readTime: '22 min read',
    excerpt: 'You wouldn\'t deploy code without tests. Why deploy models without evals? Our automated regression harness.',
    date: '2025-02-08',
    tags: ['MLOps', 'CI/CD', 'Quality'],
    content: `
# The "Vibe Check" is Not A Test

Engineers were merging PRs that "felt faster" but silently degraded model accuracy.

### The Pipeline
On every git commit to the training repo:
1.  **Unit Tests:** Check shape consistency of custom kernels.
2.  **Integration Test:** Train the model for 50 steps on a tiny "sanity" dataset.
3.  **Loss Spike Detection:** If the loss curve deviates >5% from the baseline run, the build fails.

### The Nightly Run
Every night, we run a full evaluation on the "Golden Checkpoint" against MMLU and GSM8k. This catches "alignment drift" where the model becomes safer but dumber.
    `
  },
  {
    id: 'blog-security-side-channel',
    title: 'GPU Side-Channel Attacks in Multi-Tenant Clouds',
    category: 'Blog',
    readTime: '24 min read',
    excerpt: 'Can a malicious tenant steal your weights? Exploring memory bandwidth contention attacks and MIG isolation.',
    date: '2025-02-12',
    tags: ['Security', 'Cloud', 'Research'],
    content: `
# Noisy Neighbors with Ears

In a cloud environment, you might share a node with a competitor.
Even if you are on different VMs, you share the same GPU memory bus (HBM) and L2 Cache.

### The Attack
By measuring the precise time it takes to write to memory, an attacker can infer the memory access patterns of the victim.
*   **Model Extraction:** Reconstructing the architecture (layer sizes) based on memory traffic bursts.
*   **Weight Recovery:** Theoretical attacks exist to recover weights via Rowhammer-style disturbances.

### The Defense: MIG
We strictly enforce **Multi-Instance GPU (MIG)** with Compute Instance isolation. This partitions the L2 cache and memory bus hardware, making side-channel timing attacks statistically impossible.
    `
  },
  {
    id: 'blog-data-loader-optimization',
    title: 'Benchmarking FFCV vs WebDataset',
    category: 'Blog',
    readTime: '20 min read',
    excerpt: 'PyTorch DataLoader is the bottleneck. We benchmarked FFCV\'s memcpy elimination against WebDataset\'s tar streaming.',
    date: '2025-02-15',
    tags: ['Performance', 'Data', 'PyTorch'],
    content: `
# The CPU choke

We have 8 H100s hungry for data. The CPUs are pinned at 100% just decoding JPEGs.

### WebDataset
*   **Pros:** Standard tar format, infinite streaming from S3.
*   **Cons:** Still relies on CPU-based PIL/OpenCV decoding.

### FFCV (Fast Forward Computer Vision)
FFCV pre-compiles the dataset into a custom format.
*   **JIT Decoding:** It doesn't decode the image until it's on the GPU.
*   **Memcpy Elimination:** It uses OS-level page caching to map disk directly to memory.

### The Winner
For ImageNet training, **FFCV was 4x faster** than WebDataset. However, for variable-length text (LLMs), WebDataset remains the king due to FFCV's rigid fixed-size constraints.
    `
  },
  {
    id: 'blog-cluster-auto-remediation',
    title: 'Auto-Remediation of Xid 79 Errors',
    category: 'Blog',
    readTime: '16 min read',
    excerpt: 'Sleep is for the weak, or for those with good automation. How we automatically handle GPU fall-off-the-bus events.',
    date: '2025-02-18',
    tags: ['Ops', 'Automation', 'Reliability'],
    content: `
# Xid 79: GPU has fallen off the bus

This error means the GPU stopped talking to the PCIe switch. A reboot usually fixes it, but doing that manually at 3 AM sucks.

### The Bot
We wrote a Kubernetes Operator that watches for this specific dmesg log.
1.  **Cordon:** Immediately marks the node as unschedulable.
2.  **Drain:** Evicts all pods (triggering Ray/Slurm fault tolerance).
3.  **Reset:** Issues an IPMI/BMC hard reset to power cycle the physical node.
4.  **Validate:** Runs a quick \`gpu-burn\` test upon reboot.
5.  **Uncordon:** Adds the node back to the pool.

We now recover from 50+ GPU failures a week with zero human intervention.
    `
  },
  {
    id: 'blog-quantization-fp8-reality',
    title: 'FP8 Training: The Reality vs The Hype',
    category: 'Blog',
    readTime: '26 min read',
    excerpt: 'NVIDIA says FP8 doubles throughput. They didn\'t mention the loss spikes. Our experience stabilizing E4M3 training.',
    date: '2025-02-22',
    tags: ['Training', 'Quantization', 'Math'],
    content: `
# 8 Bits is Not A Lot

Going from BF16 (16 bits) to FP8 (8 bits) reduces memory bandwidth by half.
But FP8 has limited dynamic range.
*   **E4M3:** 4 bits exponent, 3 bits mantissa. Good for weights.
*   **E5M2:** 5 bits exponent, 2 bits mantissa. Good for gradients (needs dynamic range).

### The Problem: Underflow
During training, gradients get very small. In FP8, they round down to zero. The model stops learning.

### The Solution: Delayed Scaling
We implemented **Delayed Scaling**. We track the maximum value of tensors over a rolling window of 500 steps. We use this history to calculate a scaling factor that keeps the values within the tiny "Goldilocks zone" of FP8. This stabilized the loss curve, though it added 5% compute overhead.
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