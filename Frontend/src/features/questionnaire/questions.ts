// ─────────────────────────────────────────────────────────────────────────────
// VARK Questions — 16 scenario-based items based on Neil Fleming's VARK model
//
// Key distinctions (often misunderstood):
//   Visual (V) = charts, graphs, diagrams, flowcharts, symbols — NOT photos/videos
//   Aural  (A) = discussions, lectures, talking, verbal explanation
//   Read   (R) = written text, notes, handouts, lists, definitions
//   Kinesthetic (K) = real examples, case studies, practice — NOT just physical movement
//
// Each question supports multi-select: learners pick all options that appeal to
// them, reflecting that most people are multimodal. Each chosen option adds
// one point to that style's score.
// ─────────────────────────────────────────────────────────────────────────────

import type { LearningStyle } from '../../styles/tokens'

export interface QuestionOption {
  label: string
  style: LearningStyle
}

export interface Question {
  id: number
  question: string
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'You are about to start using a new software application at work. You would most prefer:',
    options: [
      { label: 'A flowchart or diagram showing how all the features and menus connect', style: 'visual' },
      { label: 'A colleague explaining verbally how they use it and what the key parts do', style: 'auditory' },
      { label: 'A written user guide or step-by-step manual to work through at your own pace', style: 'reading' },
      { label: 'To open it immediately and figure it out through trial and error', style: 'kinesthetic' },
    ],
  },
  {
    id: 2,
    question: 'You need to explain a new process to your team. You would:',
    options: [
      { label: 'Create a flowchart showing the steps, decision points, and responsibilities', style: 'visual' },
      { label: 'Arrange a meeting to talk everyone through it and answer their questions', style: 'auditory' },
      { label: 'Write a detailed document listing the steps, rules, and who is responsible', style: 'reading' },
      { label: 'Run a practice walkthrough using a real example from current work', style: 'kinesthetic' },
    ],
  },
  {
    id: 3,
    question: 'You want to remember a list of items you need to buy. You would:',
    options: [
      { label: 'Draw a quick map or diagram grouping items by category or shop section', style: 'visual' },
      { label: 'Repeat the items out loud or record yourself saying them', style: 'auditory' },
      { label: 'Write a neatly organised list in a notepad or phone app', style: 'reading' },
      { label: 'Picture yourself physically walking through the shop and picking each item up', style: 'kinesthetic' },
    ],
  },
  {
    id: 4,
    question: 'You are choosing between two job offers. You would make your decision by:',
    options: [
      { label: 'Creating a comparison chart or diagram mapping out pros, cons, and trade-offs', style: 'visual' },
      { label: 'Talking it through with people you trust and listening to their perspectives', style: 'auditory' },
      { label: 'Writing a detailed pros-and-cons list and re-reading your notes carefully', style: 'reading' },
      { label: 'Imagining yourself actually doing each job day-to-day and how each would feel', style: 'kinesthetic' },
    ],
  },
  {
    id: 5,
    question: 'You are studying a topic you find difficult. The most helpful resource would be:',
    options: [
      { label: 'A well-labelled diagram or visual model showing how all the concepts relate', style: 'visual' },
      { label: 'A recorded lecture or podcast where an expert explains it conversationally', style: 'auditory' },
      { label: 'A detailed textbook chapter or structured set of written notes', style: 'reading' },
      { label: 'A set of worked examples or case studies where you apply the concept', style: 'kinesthetic' },
    ],
  },
  {
    id: 6,
    question: 'You are attending a training session. You find you learn best when:',
    options: [
      { label: 'The trainer uses clear diagrams, annotated slides, and visual models throughout', style: 'visual' },
      { label: 'The trainer explains concepts verbally and encourages discussion and questions', style: 'auditory' },
      { label: 'You are given handouts or printed notes to read and follow alongside the session', style: 'reading' },
      { label: 'The session includes exercises, simulations, or real-world worked examples', style: 'kinesthetic' },
    ],
  },
  {
    id: 7,
    question: 'You want to understand how your city\'s public transport network works. You would:',
    options: [
      { label: 'Study the transit map until you can visualise key routes and interchange points', style: 'visual' },
      { label: 'Ask someone who uses it regularly to explain the best routes verbally', style: 'auditory' },
      { label: 'Read a written guide covering fares, lines, stops, and timetables', style: 'reading' },
      { label: 'Buy a ticket and try a few routes to build familiarity through experience', style: 'kinesthetic' },
    ],
  },
  {
    id: 8,
    question: 'You have received feedback on a piece of work. You would prefer the feedback to be:',
    options: [
      { label: 'Annotated directly on your work using arrows, highlights, and diagrams', style: 'visual' },
      { label: 'Delivered in a face-to-face conversation where you can ask follow-up questions', style: 'auditory' },
      { label: 'Written as detailed comments and explanations attached to each section', style: 'reading' },
      { label: 'Shown alongside an example of a stronger response so you can compare directly', style: 'kinesthetic' },
    ],
  },
  {
    id: 9,
    question: 'You are preparing to give a presentation on a topic you know well. You would:',
    options: [
      { label: 'Build a set of clear diagrams and charts to anchor your key points visually', style: 'visual' },
      { label: 'Practise speaking aloud repeatedly, refining how you tell the story verbally', style: 'auditory' },
      { label: 'Write out a structured script or detailed speaker notes covering all key points', style: 'reading' },
      { label: 'Base your talk around a real case study, demonstration, or live walkthrough', style: 'kinesthetic' },
    ],
  },
  {
    id: 10,
    question: 'You are learning to run a new report or procedure at work. You prefer:',
    options: [
      { label: 'A labelled screenshot or annotated diagram showing each step on screen', style: 'visual' },
      { label: 'A colleague talking you through it while you watch and can ask questions', style: 'auditory' },
      { label: 'A written checklist or numbered procedure you can follow step by step', style: 'reading' },
      { label: 'Access to a test environment so you can try it yourself and learn by doing', style: 'kinesthetic' },
    ],
  },
  {
    id: 11,
    question: 'You are choosing a new laptop. You research it best by:',
    options: [
      { label: 'Looking at side-by-side comparison charts of specifications and performance scores', style: 'visual' },
      { label: 'Listening to a reviewer or friend talk through their hands-on experience with it', style: 'auditory' },
      { label: 'Reading detailed written reviews, articles, and long-form buyer guides', style: 'reading' },
      { label: 'Going to a shop to physically handle and test the devices yourself', style: 'kinesthetic' },
    ],
  },
  {
    id: 12,
    question: 'You want to understand a health condition that affects someone close to you. You prefer to:',
    options: [
      { label: 'Find diagrams or infographics that show how the condition affects the body', style: 'visual' },
      { label: 'Listen to a doctor or specialist explain it — or find a relevant podcast', style: 'auditory' },
      { label: 'Read medical articles, fact sheets, or a book written for non-specialists', style: 'reading' },
      { label: 'Connect with or hear from someone who has lived experience of the condition', style: 'kinesthetic' },
    ],
  },
  {
    id: 13,
    question: 'You are revising a difficult topic before an important exam. You would:',
    options: [
      { label: 'Create colour-coded mind maps, diagrams, and visual summaries for each topic', style: 'visual' },
      { label: 'Explain topics aloud to yourself or a study partner, or listen back to recordings', style: 'auditory' },
      { label: 'Re-read and rewrite your notes into condensed, organised written summaries', style: 'reading' },
      { label: 'Work through past papers, timed practice questions, and mock tests', style: 'kinesthetic' },
    ],
  },
  {
    id: 14,
    question: 'You have just moved to a new city and want to get to know it. You would:',
    options: [
      { label: 'Study a detailed map until you have a mental picture of the layout and districts', style: 'visual' },
      { label: 'Ask locals and friends for their spoken tips, recommendations, and stories', style: 'auditory' },
      { label: 'Read neighbourhood guides, blogs, and written articles about the best areas', style: 'reading' },
      { label: 'Walk and explore different areas directly, building familiarity through experience', style: 'kinesthetic' },
    ],
  },
  {
    id: 15,
    question: 'You are evaluating a new business idea or project proposal. You prefer to understand it through:',
    options: [
      { label: 'A diagram or model showing how the different parts of the concept fit together', style: 'visual' },
      { label: 'A verbal pitch or conversation where someone explains it enthusiastically', style: 'auditory' },
      { label: 'A written plan, executive summary, or structured document you can read and annotate', style: 'reading' },
      { label: 'Seeing a working prototype, pilot result, or a real-world example of it in action', style: 'kinesthetic' },
    ],
  },
  {
    id: 16,
    question: 'When you start a complex new project, you typically begin by:',
    options: [
      { label: 'Drawing a diagram or mind map that shows how all the pieces and dependencies connect', style: 'visual' },
      { label: 'Talking it through with a colleague or mentor to get an initial verbal overview', style: 'auditory' },
      { label: 'Writing a plan — goals, tasks, and timeline — in a structured document', style: 'reading' },
      { label: 'Diving into a small part of the real work to get a concrete feel for what is involved', style: 'kinesthetic' },
    ],
  },
]
