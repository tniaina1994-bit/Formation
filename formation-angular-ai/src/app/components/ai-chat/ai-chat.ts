import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as webllm from '@mlc-ai/web-llm';

@Component({
  selector: 'app-ai-chat',
  imports: [FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css',
})
export class AiChat {
  public loading = true;
  public ready = false;
  public error: string | null = null;
  public inputText = '';
  public messages: { role: 'user' | 'assistant'; content: string }[] = [];
  public isGenerating = false;
  public engine: any = null;
  public selectedModel = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

  constructor() {
    this.initEngine();
  }

  async initEngine() {
    try {
      this.error = null;
      const engine = new webllm.MLCEngine();
      this.engine = engine;
      
      engine.setInitProgressCallback((report: any) => {
        if (report.progress) {
          this.loading = true;
          this.error = `Chargement: ${report.text} (${Math.round(report.progress * 100)}%)`;
        }
      });

      await engine.reload(this.selectedModel);
      this.loading = false;
      this.ready = true;
      this.error = null;
    } catch (err) {
      this.error = 'Erreur lors du chargement du modèle: ' + (err as any).message;
      this.loading = false;
    }
  }

  async sendMessage() {
    if (!this.inputText.trim() || !this.engine || this.isGenerating) return;

    const userMessage = this.inputText.trim();
    this.messages = [...this.messages, { role: 'user', content: userMessage }];
    this.inputText = '';
    this.isGenerating = true;
    this.error = null;

    try {
      const reply = await this.engine.chat.completions.create({
        messages: this.messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: 256,
        temperature: 0.7,
      });

      const assistantMessage = reply.choices[0]?.message?.content || '(pas de réponse)';
      this.messages = [...this.messages, { role: 'assistant', content: assistantMessage }];
    } catch (err) {
      this.error = 'Erreur lors de la génération: ' + (err as any).message;
    } finally {
      this.isGenerating = false;
    }
  }
}
