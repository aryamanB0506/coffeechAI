# ☕ CoffeechAI

**CoffeechAI** is an AI-powered internal knowledge and mentorship agent that helps employees get answers fast or get connected to the right people without friction.

Instead of dumping users into docs or Slack threads, CoffeechAI intelligently decides whether a question should be answered by existing knowledge or escalated to a mentor, then handles the entire flow end-to-end.

---

## 🚀 Elevator Pitch

CoffeechAI connects employees to the right knowledge or the right people instantly. It answers FAQs when possible and intelligently matches users with mentors when human guidance matters.

---

## 💡 Inspiration

As interns thrown into complex organizations, we experienced firsthand how hard it is to:
- Understand internal systems and data structures  
- Know *who* to ask for help  
- Avoid Slack spam and awkward cold messages  

CoffeechAI was built to remove that friction and make **people connection effortless** inside companies.

---

## 🧠 What It Does

CoffeechAI acts as an **AI agent** that:
1. Receives a user question via a simple UI
2. Determines whether it’s an FAQ-style question or a mentorship request
3. Answers directly if confident using internal FAQs
4. Otherwise, finds and ranks the best mentors based on:
   - Skills & projects
   - Experience level
   - Timezone & availability
5. Generates **personalized reasons** for each recommended mentor
6. Helps users choose a mentor and schedule time seamlessly

---

## 🛠 How We Built It

### Core Architecture
- **n8n** – Workflow orchestration, branching logic, and agent routing  
- **Keywords AI** – Deterministic scoring + AI ranking for reliable decisions  
- **Structured employee data** – Skills, projects, seniority, availability  
- **Lovable** – Sleek, intuitive frontend experience  
- **Webhook-based APIs** – Modular, extensible system design  

### Agent Logic
- **Deterministic first**: Keyword-based FAQ confidence scoring  
- **AI escalation**: Mentor matching only when human help is needed  
- **Strict JSON contracts** between all nodes to ensure reliability  

This hybrid approach ensures CoffeechAI behaves like a **trustworthy AI agent**, not a guessing chatbot.

---

## 🎯 Challenges We Ran Into

- Learning **n8n** from scratch and understanding its execution model  
- Managing HTTP requests, responses, and data flow between nodes  
- Connecting and grounding **Keywords AI** correctly  
- Preventing duplicate workflow executions and branching errors  
- Designing prompts that always return **valid, structured JSON**  

**Most hackathon-worthy challenge:**  
Building a reliable AI agent pipeline where every step behaves predictably even under edge cases.

---

## 🏆 Accomplishments We’re Proud Of

- Built a fully working **end-to-end system**, not just a demo  
- Achieved reliable FAQ confidence detection before mentor escalation  
- Generated **unique, personalized reasons** for each mentor match  
- Integrated real mentor availability to avoid dead-end recommendations  
- Delivered a **sleek, intuitive UI** that feels human and approachable  
- Designed a system that can scale across teams and organizations  

---

## 📚 What We Learned

This project reinforced that **great AI agents are systems, not just models**.

We learned that:
- Hybrid systems (rules + AI) are far more reliable than AI alone  
- Clear data contracts and strict JSON outputs are critical  
- Workflow observability matters small quirks can cascade quickly  
- Prompts must be treated like code: designed, tested, iterated  
- Strong engineering is just as important as strong AI  

We also gained hands-on experience with:
- n8n’s full orchestration capabilities  
- Building polished UIs quickly with Lovable  
- Using Keywords AI to ground AI decisions  
- Writing tight, high-impact prompts  

---

## 🔮 What’s Next for CoffeechAI

- Company-wide integrations (Slack, Teams, Email)  
- Calendar scheduling and automated meeting invites  
- Feedback loops to continuously improve mentor ranking  
- Personalization based on past interactions  
- Admin dashboards for knowledge gaps and mentorship demand  

**Ultimate vision:**  
Make CoffeechAI a plug-and-play **AI agent for internal knowledge and people connection** across companies.

---

## 🧩 Tech Stack

**Frontend**
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- Lovable

**Backend / AI**
- n8n
- Keywords AI
- OpenAI API
- Webhooks & REST APIs

---

## 🏁 Getting Started

### Install
```bash
npm install
