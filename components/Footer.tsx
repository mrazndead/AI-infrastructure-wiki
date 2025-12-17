import React from 'react';
import { Server } from 'lucide-react';

interface FooterProps {
  onArticleClick?: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onArticleClick }) => {
  const handleLinkClick = (id: string) => {
    if (onArticleClick) {
      onArticleClick(id);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 pr-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary-900/20 rounded flex items-center justify-center border border-primary-500/20">
                <Server className="text-primary-500 w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">InfraMind</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              The premier knowledge hub for AI infrastructure engineering. From silicon to swarm orchestration, we document the stack that powers intelligence.
            </p>
          </div>
          
          {/* Hardware - Compute Silicon */}
          <div>
            <h3 className="text-white font-semibold mb-6 border-b border-slate-800 pb-2 inline-block">Compute Silicon</h3>
            <ul className="space-y-3 text-slate-400 text-xs">
              <li onClick={() => handleLinkClick('h100-vs-b200')} className="hover:text-primary-400 cursor-pointer transition-colors">NVIDIA H100 Hopper</li>
              <li onClick={() => handleLinkClick('h100-vs-b200')} className="hover:text-primary-400 cursor-pointer transition-colors">NVIDIA B200 Blackwell</li>
              <li onClick={() => handleLinkClick('mi300x-vs-h100')} className="hover:text-primary-400 cursor-pointer transition-colors">AMD MI300X Instinct</li>
              <li onClick={() => handleLinkClick('tpu-v5p-architecture')} className="hover:text-primary-400 cursor-pointer transition-colors">Google TPU v5p Pods</li>
              <li onClick={() => handleLinkClick('trainium2-aws')} className="hover:text-primary-400 cursor-pointer transition-colors">AWS Trainium2 Clusters</li>
              <li onClick={() => handleLinkClick('cerebras-wse3')} className="hover:text-primary-400 cursor-pointer transition-colors">Cerebras WSE-3 Wafer</li>
              <li onClick={() => handleLinkClick('lpu-inference')} className="hover:text-primary-400 cursor-pointer transition-colors">Groq LPU Inference</li>
              <li onClick={() => handleLinkClick('gaudi3-architecture')} className="hover:text-primary-400 cursor-pointer transition-colors">Intel Gaudi 3 Accelerators</li>
              <li onClick={() => handleLinkClick('tesla-dojo-d1')} className="hover:text-primary-400 cursor-pointer transition-colors">Tesla Dojo D1</li>
              <li onClick={() => handleLinkClick('custom-ai-asics')} className="hover:text-primary-400 cursor-pointer transition-colors">Custom AI ASICs</li>
              <li onClick={() => handleLinkClick('fpga-acceleration')} className="hover:text-primary-400 cursor-pointer transition-colors">FPGA Acceleration (Alveo)</li>
              <li onClick={() => handleLinkClick('edge-tpu-jetson')} className="hover:text-primary-400 cursor-pointer transition-colors">Edge TPU & Jetson Orin</li>
            </ul>
          </div>

          {/* Hardware - Infrastructure */}
          <div>
            <h3 className="text-white font-semibold mb-6 border-b border-slate-800 pb-2 inline-block">Physical Infra</h3>
            <ul className="space-y-3 text-slate-400 text-xs">
              <li onClick={() => handleLinkClick('infiniband-vs-ethernet')} className="hover:text-primary-400 cursor-pointer transition-colors">Infiniband NDR 400G</li>
              <li onClick={() => handleLinkClick('infiniband-vs-ethernet')} className="hover:text-primary-400 cursor-pointer transition-colors">Spectrum-X Ethernet</li>
              <li onClick={() => handleLinkClick('nvlink-switch-systems')} className="hover:text-primary-400 cursor-pointer transition-colors">NVLink Switch Systems</li>
              <li onClick={() => handleLinkClick('800g-osfp-optics')} className="hover:text-primary-400 cursor-pointer transition-colors">800G OSFP Optics</li>
              <li onClick={() => handleLinkClick('optical-interconnects')} className="hover:text-primary-400 cursor-pointer transition-colors">Co-Packaged Optics (CPO)</li>
              <li onClick={() => handleLinkClick('hbm3e-explained')} className="hover:text-primary-400 cursor-pointer transition-colors">HBM3e Memory Stacks</li>
              <li onClick={() => handleLinkClick('immersion-cooling')} className="hover:text-primary-400 cursor-pointer transition-colors">Direct Liquid Cooling (DLC)</li>
              <li onClick={() => handleLinkClick('immersion-cooling')} className="hover:text-primary-400 cursor-pointer transition-colors">2-Phase Immersion Cooling</li>
              <li onClick={() => handleLinkClick('power-delivery-busbars')} className="hover:text-primary-400 cursor-pointer transition-colors">48V DC Busbars</li>
              <li onClick={() => handleLinkClick('rear-door-heat-exchangers')} className="hover:text-primary-400 cursor-pointer transition-colors">Rear Door Heat Exchangers</li>
              <li onClick={() => handleLinkClick('green-energy-nuclear')} className="hover:text-primary-400 cursor-pointer transition-colors">Nuclear SMR Power</li>
              <li onClick={() => handleLinkClick('data-center-security-soc2')} className="hover:text-primary-400 cursor-pointer transition-colors">Tier 4 Data Center Security</li>
            </ul>
          </div>

          {/* Software - Training & Ops */}
          <div>
            <h3 className="text-white font-semibold mb-6 border-b border-slate-800 pb-2 inline-block">Training Stack</h3>
            <ul className="space-y-3 text-slate-400 text-xs">
              <li onClick={() => handleLinkClick('pytorch-fsdp')} className="hover:text-primary-400 cursor-pointer transition-colors">PyTorch 2.0 / FSDP</li>
              <li onClick={() => handleLinkClick('jax-xla-compiler')} className="hover:text-primary-400 cursor-pointer transition-colors">JAX / XLA Compiler</li>
              <li onClick={() => handleLinkClick('ray-distributed-training')} className="hover:text-primary-400 cursor-pointer transition-colors">Ray Distributed Clusters</li>
              <li onClick={() => handleLinkClick('kubernetes-gpu-scheduling')} className="hover:text-primary-400 cursor-pointer transition-colors">Kubernetes (EKS/GKE)</li>
              <li onClick={() => handleLinkClick('slurm-workload-manager')} className="hover:text-primary-400 cursor-pointer transition-colors">Slurm Workload Manager</li>
              <li onClick={() => handleLinkClick('megatron-lm')} className="hover:text-primary-400 cursor-pointer transition-colors">Megatron-LM Training</li>
              <li onClick={() => handleLinkClick('deepspeed-optimization')} className="hover:text-primary-400 cursor-pointer transition-colors">DeepSpeed Optimization</li>
              <li onClick={() => handleLinkClick('mosaicml-foundry')} className="hover:text-primary-400 cursor-pointer transition-colors">MosaicML LLM Foundry</li>
              <li onClick={() => handleLinkClick('checkpointing-strategies')} className="hover:text-primary-400 cursor-pointer transition-colors">Checkpointing (Lustre/S3)</li>
              <li onClick={() => handleLinkClick('docker-singularity-containers')} className="hover:text-primary-400 cursor-pointer transition-colors">Docker & Singularity</li>
              <li onClick={() => handleLinkClick('prometheus-grafana-monitoring')} className="hover:text-primary-400 cursor-pointer transition-colors">Prometheus & Grafana</li>
              <li onClick={() => handleLinkClick('wandb-mlflow-tracking')} className="hover:text-primary-400 cursor-pointer transition-colors">Weights & Biases MLFlow</li>
            </ul>
          </div>

          {/* Software - Inference & Agents */}
          <div>
            <h3 className="text-white font-semibold mb-6 border-b border-slate-800 pb-2 inline-block">Inference & Agents</h3>
            <ul className="space-y-3 text-slate-400 text-xs">
              <li onClick={() => handleLinkClick('vllm-paged-attention')} className="hover:text-primary-400 cursor-pointer transition-colors">vLLM & PagedAttention</li>
              <li onClick={() => handleLinkClick('tensorrt-llm-deployment')} className="hover:text-primary-400 cursor-pointer transition-colors">NVIDIA TensorRT-LLM</li>
              <li onClick={() => handleLinkClick('triton-inference-server')} className="hover:text-primary-400 cursor-pointer transition-colors">Triton Inference Server</li>
              <li onClick={() => handleLinkClick('flash-attention-explained')} className="hover:text-primary-400 cursor-pointer transition-colors">FlashAttention-2 Kernels</li>
              <li onClick={() => handleLinkClick('openai-triton-dsl')} className="hover:text-primary-400 cursor-pointer transition-colors">OpenAI Triton DSL</li>
              <li onClick={() => handleLinkClick('quantization-awq-gptq')} className="hover:text-primary-400 cursor-pointer transition-colors">Quantization (AWQ/GPTQ)</li>
              <li onClick={() => handleLinkClick('vector-databases-overview')} className="hover:text-primary-400 cursor-pointer transition-colors">Vector DB (Milvus/Pinecone)</li>
              <li onClick={() => handleLinkClick('rag-architecture-patterns')} className="hover:text-primary-400 cursor-pointer transition-colors">RAG Pipelines (LlamaIndex)</li>
              <li onClick={() => handleLinkClick('langchain-orchestration')} className="hover:text-primary-400 cursor-pointer transition-colors">LangChain Orchestration</li>
              <li onClick={() => handleLinkClick('autogen-framework')} className="hover:text-primary-400 cursor-pointer transition-colors">Microsoft AutoGen Swarms</li>
              <li onClick={() => handleLinkClick('crewai-task-delegation')} className="hover:text-primary-400 cursor-pointer transition-colors">CrewAI Role Playing</li>
              <li onClick={() => handleLinkClick('dspy-programming-models')} className="hover:text-primary-400 cursor-pointer transition-colors">DSPy Prompt Optimization</li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-800 pt-8 flex justify-center text-xs text-slate-600">
          <p>© 2026 InfraMind Inc. The AI Infrastructure Knowledge Base. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};