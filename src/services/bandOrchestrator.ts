export type AgentRole = 'Content Intake' | 'Cognitive Bias' | 'Verification' | 'Echo Chamber' | 'Explainability' | 'Human Review' | 'Orchestrator';

export interface BandMessage {
  id: string;
  agentRole: AgentRole;
  content: any; // Could be structured JSON data, markdown, or plain text
  timestamp: number;
}

export class BandOrchestrator {
  private messages: BandMessage[] = [];
  private listeners: ((messages: BandMessage[]) => void)[] = [];
  
  // Official Band SDK mock structure to demonstrate production readiness
  private bandClient = {
    rooms: {
      send: async (roomId: string, payload: any) => {
        // Production API call would happen here
        console.log(`[BAND API -> ${roomId}] Payload:`, payload);
      }
    }
  };
  
  public subscribe(listener: (messages: BandMessage[]) => void) {
    this.listeners.push(listener);
    // Immediately push current state to new listener
    listener([...this.messages]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async postMessage(agentRole: AgentRole, content: any) {
    const msg: BandMessage = {
      id: Math.random().toString(36).substring(7),
      agentRole,
      content,
      timestamp: Date.now()
    };
    
    // Feature Flag: Transitions from Hackathon Mode to Production Mode instantly
    // (Credits arrive June 12th)
    const BAND_API_KEY = (import.meta as any).env?.VITE_BAND_API_KEY;
    const BAND_ROOM_ID = (import.meta as any).env?.VITE_BAND_ROOM_ID || 'nexus-incident-room-1';

    if (BAND_API_KEY) {
      // Production Mode: Send to actual Band Room
      try {
        await this.bandClient.rooms.send(BAND_ROOM_ID, {
          agent: agentRole,
          data: content
        });
      } catch (err) {
        console.error("Band API Sync Error:", err);
      }
    }
    
    // Local State Update (keeps the UI fast and works without credits)
    this.messages.push(msg);
    this.notifyListeners();
    
    return msg;
  }
  
  public getMessages() {
    return [...this.messages];
  }

  public clearRoom() {
    this.messages = [];
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(l => l([...this.messages]));
  }
}

// Singleton instance for the hackathon demo
export const bandOrchestrator = new BandOrchestrator();
