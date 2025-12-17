import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Cpu, Box, LayoutGrid, Terminal, Shield, Zap, FileText, Server, Cloud, Key, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- Types ---
interface DocPage {
  id: string;
  title: string;
  content: string;
}

interface DocCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  pages: DocPage[];
}

// --- Content Data (Simulating the full docs structure) ---
const nvidiaDocs: DocCategory[] = [
  {
    id: 'release_notes',
    title: 'Release Notes',
    icon: <FileText className="w-4 h-4" />,
    pages: [
      {
        id: 'rel_notes_5_1',
        title: 'Release Notes 5.1',
        content: `
# NVIDIA AI Enterprise 5.1 Release Notes

**Date:** December 2024  
**Version:** 5.1.0

## 1. Introduction
NVIDIA AI Enterprise 5.1 is the latest production branch release. This release focuses on the expansion of NVIDIA NIM (Inference Microservices) for generative AI, updated support for Kubernetes v1.29, and performance improvements for Llama 3 70B inference on H100 GPU clusters.

## 2. What's New
*   **NVIDIA NIM:** Integrated catalog for deploying foundation models (Llama 3, Mistral, Gemma) as standard Docker containers with pre-configured TensorRT engines.
*   **NVIDIA Base Command Manager:** Enhanced cluster provisioning for Blackwell (B200) architecture (Preview).
*   **Triton Inference Server:** Updated to 24.04 with support for decoupled input/output streams.
*   **RAPIDS:** cuDF accelerator for pandas now supports version 2.2 with 100% API coverage.

## 3. Known Issues
*   **#49221:** On VMware vSphere 8.0U2, vGPU profiles with >64GB framebuffer may experience slow migration times during vMotion. Workaround: Increase vMotion network timeout.
*   **#50012:** NVIDIA Network Operator may fail to initialize on RHEL 9.3 if Secure Boot is enabled without importing MOK keys.
        `
      },
      {
        id: 'support_matrix',
        title: 'Support Matrix',
        content: `
# Product Support Matrix

## 1. Supported Hardware
NVIDIA AI Enterprise is supported on NVIDIA-Certified Systems.

| System Type | GPU Architectures | Examples |
| :--- | :--- | :--- |
| **Data Center** | Hopper, Ampere, Turing | H100, A100, A30, T4 |
| **Workstation** | Ada Lovelace, Ampere | RTX 6000 Ada, RTX A6000 |
| **Edge** | Orin, Xavier | IGX Orin, Jetson AGX Orin |

## 2. Supported Hypervisors
| Hypervisor | Version |
| :--- | :--- |
| VMware vSphere | 7.0 U3, 8.0 U1, 8.0 U2 |
| Red Hat Virtualization | 4.4 |
| Nutanix AHV | 6.5 LTS |

## 3. Supported Container Platforms
| Platform | Version |
| :--- | :--- |
| Red Hat OpenShift | 4.12, 4.13, 4.14 |
| VMware Tanzu | TKG 2.0 |
| Canonical Kubernetes | 1.27, 1.28, 1.29 |
        `
      }
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment Guide',
    icon: <Server className="w-4 h-4" />,
    pages: [
      {
        id: 'deploy_baremetal',
        title: 'Bare Metal Deployment',
        content: `
# Bare Metal Deployment Guide (Ubuntu/RHEL)

This guide covers installing the NVIDIA AI Enterprise software stack on a physical server running Ubuntu 22.04 LTS or RHEL 9.

## Prerequisites
*   NVIDIA-Certified System with H100 or A100 GPUs.
*   Valid NVIDIA AI Enterprise entitlement.
*   Root access.

## Step 1: Install NVIDIA Drivers
Do not install the standard drivers from the repo. You must install the Data Center specific drivers.

\`\`\`bash
# Add NVIDIA proprietary repository
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y cuda-drivers-550
\`\`\`

## Step 2: Install Container Toolkit
To allow Docker to access the GPU:

\`\`\`bash
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
\`\`\`

## Step 3: Verify Installation
Run the \`nvidia-smi\` command to verify driver load, and then run a test container:

\`\`\`bash
docker run --rm --gpus all nvidia/cuda:12.3-base-ubuntu22.04 nvidia-smi
\`\`\`
        `
      },
      {
        id: 'deploy_vmware',
        title: 'VMware vSphere Deployment',
        content: `
# VMware vSphere Deployment

Deploying AI workloads on virtualized infrastructure requires the NVIDIA vGPU Host Driver (VIB) installed on the ESXi host.

## 1. Architecture
*   **ESXi Host:** Runs the NVIDIA vGPU Manager VIB.
*   **Guest VM:** Runs the NVIDIA Guest Driver (Grid Driver).
*   **License Server:** NLS (NVIDIA License System) instance to lease vGPU licenses.

## 2. Installing the VIB
1.  Put the ESXi host into maintenance mode.
2.  Upload the bundle \`NVD-VGPU_8.0.0-1OEM.zip\` to the datastore.
3.  Install via CLI:
    \`\`\`bash
    esxcli software vib install -d /vmfs/volumes/datastore1/NVD-VGPU_8.0.0-1OEM.zip
    \`\`\`
4.  Reboot host.

## 3. Configuring the VM
1.  Edit VM Settings > Add New Device > PCI Device.
2.  Select **NVIDIA GRID vGPU**.
3.  Choose a profile (e.g., \`grid_a100-80c\`).
4.  Boot VM and install the Linux Guest Driver.
        `
      },
      {
        id: 'deploy_cloud',
        title: 'Cloud Deployment (CSP)',
        content: `
# Cloud Deployment (AWS, Azure, GCP)

NVIDIA AI Enterprise is available as a specialized Machine Image (AMI/VMI) on major cloud providers.

## AWS Marketplace
1.  Go to AWS Marketplace and search for **"NVIDIA AI Enterprise"**.
2.  Select the **"NVIDIA AI Enterprise 5 - Ubuntu 22.04"** AMI.
3.  Launch on a supported instance type:
    *   **P5.48xlarge** (8x H100)
    *   **P4d.24xlarge** (8x A100)
    *   **G5.12xlarge** (4x A10)
4.  The image comes pre-baked with Docker, NVIDIA Container Toolkit, and NGC CLI.

## Licensing in Cloud
When using the Marketplace image, licensing is handled via "Pay-as-you-go" (hourly billing) integrated into your AWS bill. You do not need to set up a separate CLS/DLS license server.
        `
      }
    ]
  },
  {
    id: 'nim_microservices',
    title: 'NVIDIA NIM (GenAI)',
    icon: <Zap className="w-4 h-4" />,
    pages: [
      {
        id: 'nim_overview',
        title: 'NIM Overview',
        content: `
# NVIDIA NIM (Inference Microservices)

NVIDIA NIM is a set of accelerated inference microservices designed to simplify the deployment of generative AI models. NIM abstracts away the complexity of model optimization (TensorRT), runtime (Triton), and API serving.

## Key Benefits
*   **Standardized API:** All NIMs expose an OpenAI-compatible API (\`/v1/chat/completions\`).
*   **Enterprise Security:** CVE-patched containers maintained by NVIDIA.
*   **Auto-Optimization:** Automatically selects the best TensorRT engine for the detected GPU (A100, H100, L40S).

## The Catalog
NIMs are available for:
*   **LLMs:** Llama 3, Mistral, Gemma, Mixtral.
*   **Visual:** Stable Diffusion XL, Edify.
*   **Healthcare:** BioNeMo (AlphaFold2, MolMIM).
        `
      },
      {
        id: 'nim_llama3',
        title: 'Deploying Llama 3',
        content: `
# Deploying Llama 3 with NIM

## Prerequisites
*   NVIDIA GPU (Ampere or newer).
*   NGC API Key.

## Docker Run Command
The simplest way to start the service is via Docker:

\`\`\`bash
export NGC_API_KEY="nvapi-..."
export LOCAL_NIM_CACHE=~/.cache/nim

docker run -it --rm --name=llama3 \\
  --runtime=nvidia \\
  --gpus all \\
  -e NGC_API_KEY \\
  -v $LOCAL_NIM_CACHE:/opt/nim/.cache \\
  -p 8000:8000 \\
  nvcr.io/nim/meta/llama3-8b-instruct:latest
\`\`\`

## Consuming the API
Once running, you can query it using standard HTTP requests:

\`\`\`bash
curl -X 'POST' \\
  'http://localhost:8000/v1/chat/completions' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "model": "meta/llama3-8b-instruct",
  "messages": [{"role":"user", "content":"Write a Python script to sort a list."}],
  "max_tokens": 64
}'
\`\`\`
        `
      }
    ]
  },
  {
    id: 'software_stack',
    title: 'AI Software Stack',
    icon: <Box className="w-4 h-4" />,
    pages: [
      {
        id: 'triton_server',
        title: 'Triton Inference Server',
        content: `
# Triton Inference Server

Triton is an open-source inference-serving software that streamlines AI inferencing.

## Features
*   **Multi-Framework:** TensorFlow, PyTorch, ONNX, TensorRT, OpenVINO.
*   **Dynamic Batching:** Aggregates requests to increase throughput.
*   **Concurrent Model Execution:** Runs multiple models on a single GPU.

## Model Repository Structure
Triton requires a specific directory structure:

\`\`\`text
model_repository/
  llama3/
    config.pbtxt
    1/
      model.plan
\`\`\`

## Configuration (config.pbtxt)
\`\`\`protobuf
name: "llama3"
platform: "tensorrt_plan"
max_batch_size: 8
input [
  {
    name: "input_ids"
    data_type: TYPE_INT32
    dims: [ -1 ]
  }
]
output [
  {
    name: "logits"
    data_type: TYPE_FP32
    dims: [ -1, 32000 ]
  }
]
\`\`\`
        `
      },
      {
        id: 'rapids_data',
        title: 'RAPIDS Data Science',
        content: `
# RAPIDS

RAPIDS provides a suite of open source software libraries to execute data science pipelines entirely on GPUs.

## cuDF (GPU DataFrames)
cuDF is a GPU DataFrame library for loading, joining, aggregating, filtering, and manipulating data.

\`\`\`python
import cudf

# Load CSV directly to GPU memory
gdf = cudf.read_csv("dataset.csv")

# Filter and GroupBy (runs on GPU)
result = gdf[gdf['value'] > 0].groupby('category').mean()
\`\`\`

## RAPIDS Accelerator for Spark
Allows you to run existing Apache Spark workloads on GPUs without code changes. The plugin intercepts the physical execution plan and translates supported operations (Joins, Sorts, Aggregates) into GPU instructions.
        `
      }
    ]
  },
  {
    id: 'infrastructure',
    title: 'Cloud Native Infra',
    icon: <Cloud className="w-4 h-4" />,
    pages: [
      {
        id: 'gpu_operator',
        title: 'NVIDIA GPU Operator',
        content: `
# NVIDIA GPU Operator

The GPU Operator manages the lifecycle of GPU resources in Kubernetes.

## Components
1.  **NFD (Node Feature Discovery):** Labels nodes with GPU hardware info.
2.  **Driver Container:** Installs the kernel driver on the host.
3.  **Container Toolkit:** Installs the runtime libraries.
4.  **Device Plugin:** Exposes \`nvidia.com/gpu\` resources to the K8s scheduler.
5.  **DCGM Exporter:** Exports GPU metrics to Prometheus.

## Installation via Helm

\`\`\`bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

helm install --wait --generate-name \\
     -n gpu-operator --create-namespace \\
     nvidia/gpu-operator
\`\`\`
        `
      },
      {
        id: 'network_operator',
        title: 'NVIDIA Network Operator',
        content: `
# NVIDIA Network Operator

The Network Operator enables high-speed networking (RDMA/RoCE) for Kubernetes clusters.

## Key Capabilities
*   **MOFED Installation:** Manages Mellanox OFED drivers.
*   **SR-IOV:** Configures Virtual Functions (VFs) for hardware isolation.
*   **Macvlan / Multus:** Enables secondary networks for separating storage/compute traffic.
*   **GPUDirect RDMA:** Allows NICs to read directly from GPU memory, bypassing CPU.
        `
      }
    ]
  },
  {
    id: 'licensing',
    title: 'Licensing & Activation',
    icon: <Key className="w-4 h-4" />,
    pages: [
      {
        id: 'licensing_guide',
        title: 'Licensing Guide',
        content: `
# NVIDIA AI Enterprise Licensing

To access the software and receive support, you must have a valid license entitlement.

## Types of Licenses
1.  **Per-GPU Subscription:** For on-premise servers.
2.  **Cloud Instance (PAYG):** Included in the hourly rate of the VM.
3.  **Evaluation:** 90-day trial license.

## DLS (Delegated License Service)
For air-gapped environments, you deploy a DLS appliance (virtual machine) on-premise.
1.  Download DLS virtual appliance from the NVIDIA Licensing Portal.
2.  Install on vSphere or KVM.
3.  Bind the DLS to your portal account.
4.  Point your client VMs to the DLS IP address.
        `
      }
    ]
  }
];

export const NvidiaPage: React.FC = () => {
  const [activePageId, setActivePageId] = useState<string>('rel_notes_5_1');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'release_notes': true,
    'deployment': true,
    'nim_microservices': true,
    'software_stack': false,
    'infrastructure': false,
    'licensing': false
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const getActiveContent = () => {
    for (const cat of nvidiaDocs) {
      for (const page of cat.pages) {
        if (page.id === activePageId) return page.content;
      }
    }
    return "# Page Not Found";
  };

  const getActiveTitle = () => {
    for (const cat of nvidiaDocs) {
      for (const page of cat.pages) {
        if (page.id === activePageId) return page.title;
      }
    }
    return "Documentation";
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center space-x-3 text-green-400 font-bold mb-1">
             <div className="w-8 h-8 bg-green-500 text-black rounded flex items-center justify-center shadow-lg shadow-green-900/20">
                <Cpu className="w-5 h-5" />
             </div>
             <span className="text-lg tracking-tight">AI Enterprise</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500 font-mono">v5.1.0 (Latest)</span>
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Stable</span>
          </div>
        </div>

        {/* Navigation Tree */}
        <nav className="p-4 space-y-2">
          {nvidiaDocs.map((cat) => (
            <div key={cat.id} className="mb-2">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 group-hover:text-green-400 transition-colors">{cat.icon}</span>
                  <span>{cat.title}</span>
                </div>
                {expandedCategories[cat.id] ? 
                  <ChevronDown className="w-3 h-3 text-slate-500" /> : 
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                }
              </button>
              
              {/* Nested Pages */}
              {expandedCategories[cat.id] && (
                <div className="mt-1 ml-4 pl-4 border-l border-slate-800 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {cat.pages.map(page => (
                    <button
                      key={page.id}
                      onClick={() => {
                        setActivePageId(page.id);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors flex items-center ${
                        activePageId === page.id
                          ? 'text-green-400 bg-green-500/10 font-medium border border-green-500/10'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      {activePageId === page.id && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>}
                      {page.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="mt-8 mx-4 p-4 bg-slate-900 rounded-xl border border-slate-800 mb-8">
           <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
             <Settings className="w-3 h-3" />
             <span>Resources</span>
           </div>
           <ul className="space-y-2.5 text-xs text-slate-500">
              <li className="hover:text-green-400 cursor-pointer flex items-center"><ChevronRight className="w-2 h-2 mr-1" /> PDF Download</li>
              <li className="hover:text-green-400 cursor-pointer flex items-center"><ChevronRight className="w-2 h-2 mr-1" /> API Reference</li>
              <li className="hover:text-green-400 cursor-pointer flex items-center"><ChevronRight className="w-2 h-2 mr-1" /> Knowledge Base</li>
              <li className="hover:text-green-400 cursor-pointer flex items-center"><ChevronRight className="w-2 h-2 mr-1" /> Open a Support Case</li>
           </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-950">
         {/* Breadcrumb / Top Bar */}
         <div className="h-16 border-b border-slate-800 flex items-center px-8 md:px-12 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center text-sm text-slate-500 space-x-2">
               <span>Docs</span>
               <ChevronRight className="w-3 h-3" />
               <span>AI Enterprise 5.1</span>
               <ChevronRight className="w-3 h-3" />
               <span className="text-green-400 font-medium">{getActiveTitle()}</span>
            </div>
         </div>

         {/* Content Wrapper */}
         <div className="p-8 md:p-12 max-w-5xl mx-auto">
            <article className="prose prose-invert prose-lg max-w-none 
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:text-green-400
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mt-8 prose-h3:text-slate-200
              prose-p:text-slate-400 prose-p:leading-relaxed
              prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-green-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:border prose-code:border-slate-800
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:p-0
              prose-ul:list-disc prose-ul:pl-6 prose-li:text-slate-400 prose-li:my-1
              prose-table:w-full prose-table:text-sm prose-table:border-collapse
              prose-th:text-left prose-th:p-3 prose-th:bg-slate-900 prose-th:text-slate-200 prose-th:border prose-th:border-slate-700
              prose-td:p-3 prose-td:border prose-td:border-slate-800 prose-td:text-slate-400
            ">
              <ReactMarkdown
                components={{
                  pre: ({node, ...props}) => (
                    <div className="relative group my-6">
                      <div className="absolute top-0 right-0 px-3 py-1 text-xs text-slate-500 font-mono bg-slate-800 rounded-bl-lg border-b border-l border-slate-700">bash</div>
                      <pre className="overflow-x-auto p-6 bg-slate-900 rounded-xl border border-slate-800" {...props} />
                    </div>
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-8 border border-slate-800 rounded-lg">
                      <table className="w-full text-left" {...props} />
                    </div>
                  )
                }}
              >
                {getActiveContent()}
              </ReactMarkdown>
            </article>

            {/* Page Footer */}
            <div className="mt-20 pt-8 border-t border-slate-800">
               <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                  <div className="mb-4 md:mb-0">
                     <p>© 2024 NVIDIA Corporation</p>
                  </div>
                  <div className="flex space-x-6">
                     <button className="hover:text-green-400 transition-colors">Privacy Policy</button>
                     <button className="hover:text-green-400 transition-colors">Legal Info</button>
                     <button className="hover:text-green-400 transition-colors">Feedback</button>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};