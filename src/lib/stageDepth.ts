// Extra depth for each Timeline stage: facts worth knowing and questions to ask.
// Sources: Judicial Council "Juvenile Dependency Court and You", California Courts
// Self-Help Guide (parents, children and youth, relatives), WIC 252, 361, 361.2, 366.21,
// 366.22, 366.26, 16001.9, Cal. Rules of Court 5.530, 8.406, 8.450. Checked Nov 2026.

type Role = 'parent' | 'youth' | 'supporter'

export interface StageDepth {
  goodToKnow: string[]
  ask: string[]
  askWho: string
}

const LAWYER = 'Ask your lawyer'
const WORKER = 'Ask the social worker'

export const STAGE_DEPTH: Record<string, Record<Role, StageDepth>> = {
  'case-opening': {
    parent: {
      goodToKnow: [
        'If your child was removed, the social worker has two court days to file a petition. The first hearing is by the end of the next court day after that.',
        'A social worker can talk with your child at school without a court order. They must tell you afterward.',
        'The first places the county looks for your child to stay are the other parent, a relative, or a close family friend. Give names right away.',
      ],
      ask: ['When and where is my first hearing?', 'How do I reach you before court?', 'Can my child stay with a relative or family friend right now?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'You will have your own lawyer. What you tell them is private unless you say they can share it.',
        'Your social worker should visit you every month.',
        'You are not in trouble. This is about keeping you safe.',
      ],
      ask: ['Where will I live, and for how long?', 'When can I see my parents and my brothers and sisters?', 'Can I stay at my school?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'Do not wait to be called. Contact the social worker now and say you want to help.',
        'Within 30 days of a removal, the county has to notify grandparents, adult siblings, and other adult relatives.',
        'Before a child can be placed with you, the county checks your home and runs background checks on every adult who lives there.',
      ],
      ask: ['What do I need to do to have the child placed with me?', 'Can I visit or call the child now?', 'When is the next hearing?'],
      askWho: WORKER,
    },
  },
  detention: {
    parent: {
      goodToKnow: [
        'The judge decides whether your child can come home today. If not, the judge sets your visits.',
        'The judge will ask who the other parent is and whether your child may have Native American family.',
        'You keep the right to make school and health decisions for your child unless the judge limits it.',
      ],
      ask: ['What would the judge need to see for my child to come home today?', 'How often can I visit, and can it start this week?', 'Which relatives can the county check for placement?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'If you are 10 or older, someone must tell you the court date and ask if you want to go.',
        'The judge decides where you stay for now.',
        'You can ask the judge for visits with your brothers and sisters.',
      ],
      ask: ['Can I go to court?', 'Can I stay with a relative or a family friend?', 'How do I reach you if something is wrong?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'The first choices for placement are the other parent, relatives, and close family friends.',
        'Form JV-285 tells the judge who you are and how you want to help. Give it to the judge\'s clerk.',
        'Court is closed to the public. You can ask to attend, and the judge decides.',
      ],
      ask: ['Has my home check been scheduled?', 'What visits can I have while the child is placed somewhere else?', 'Who is the child\'s lawyer?'],
      askWho: WORKER,
    },
  },
  jurisdiction: {
    parent: {
      goodToKnow: [
        'The county has to prove its claims are more likely true than not. You do not have to prove you are innocent.',
        'You can admit, plead no contest, let the judge decide from the report, or ask for a trial. Decide with your lawyer.',
        'If none of the claims are found true, the case is dismissed.',
      ],
      ask: ['What does each claim in the petition mean?', 'What are my choices, and what happens with each one?', 'What is wrong in the social worker\'s report, and how do we show it?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'The judge decides if what the county said is true.',
        'You can go to court and talk to the judge. Ask your lawyer if anyone can make you answer questions.',
        'Your lawyer tells the judge what you want and what they think is best for you. Those can be different.',
      ],
      ask: ['Do I have to say anything in court?', 'What happens if the judge says it is true?', 'What will you tell the judge I want?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'This hearing is about whether the county\'s claims are true.',
        'You may be asked to be a witness about what you have seen.',
        'The most useful help right now is practical: rides, child care, and showing up.',
      ],
      ask: ['Is there anything I should be ready to tell the court?', 'Can I come to the hearing?', 'How can I help with visits?'],
      askWho: WORKER,
    },
  },
  disposition: {
    parent: {
      goodToKnow: [
        'To remove your child at this hearing, the county needs strong proof, called clear and convincing evidence.',
        'In most cases the court must order services to help you get your child back.',
        'Your time is already running. Most parents get about a year. If your child is under 3, it may be six months.',
      ],
      ask: ['Does every item in my case plan fit my situation?', 'How do I prove I am doing each service?', 'Can my visits be longer, or without a monitor?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'The judge decides where you live and what help you and your family get.',
        'You can help make your case plan. Ask your social worker to go over it with you and give you a copy.',
        'You have the right to stay at your school.',
      ],
      ask: ['Can I see my case plan?', 'Can I live with my brothers and sisters?', 'Who makes school decisions for me?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'The judge decides placement and visits at this hearing.',
        'If the child lives with you, form JV-290 lets you tell the judge how they are doing.',
        'Caregivers may be able to get financial support. Ask what you qualify for.',
      ],
      ask: ['What financial support can I get as a caregiver?', 'What is my part in the visit schedule?', 'Who do I call about school and doctor visits?'],
      askWho: WORKER,
    },
  },
  'six-month': {
    parent: {
      goodToKnow: [
        'The judge can return your child, give you about six more months, or end services.',
        'If your child was under 3 when removed, services can end at this hearing.',
        'The judge also checks whether the county gave you the services it was ordered to give.',
      ],
      ask: ['What is the county recommending, and why?', 'What proof should I bring?', 'If the county did not provide a service, how do we tell the judge?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'The judge checks on you every six months.',
        'You can tell the judge how your home, school, and visits are going.',
        'You can ask for a team meeting any time something is not working.',
      ],
      ask: ['Can I talk to the judge?', 'Can my visits change?', 'What is the plan for me going home?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'Your notes about the child\'s health, school, and mood help the judge.',
        'If you have cared for the child day to day for a long time, you can ask for de facto parent status.',
        'If the child is not placed with you, you can still ask for visits.',
      ],
      ask: ['Should I fill out a caregiver form before the hearing?', 'Does the child need any services I can help set up?', 'Is the plan still for the child to go home?'],
      askWho: WORKER,
    },
  },
  'twelve-month': {
    parent: {
      goodToKnow: [
        'The judge decides whether your child can come home. If not, the judge decides whether to give more time or end services.',
        'If services end, the court sets a hearing to choose a permanent plan.',
        'To fight an order setting that hearing, you usually have only 7 days to start a writ.',
      ],
      ask: ['What would the judge need to see to send my child home?', 'Can we ask for more time, and on what basis?', 'If the judge sets a .26 hearing, will you file the writ notice?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'The judge decides if you can go home or if the plan needs to change.',
        'What you want matters. Tell your lawyer.',
        'If going home is not possible, the judge starts planning a long-term home for you.',
      ],
      ask: ['What are the choices for where I live long term?', 'What do you think is best, and is it different from what I want?', 'Can I stay where I am?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'This hearing can change the direction of the case.',
        'If the plan may change to guardianship or adoption, ask what that would mean for you.',
        'Relatives who are already caring for the child are preferred for guardianship.',
      ],
      ask: ['What is the county recommending?', 'If the child cannot go home, would I be considered as a long-term home?', 'What support would I get as a guardian or adoptive parent?'],
      askWho: WORKER,
    },
  },
  'eighteen-month': {
    parent: {
      goodToKnow: [
        'This is usually the last hearing where the judge can return your child before a permanent plan.',
        'If your child is not returned, services usually end.',
        'You can keep visiting unless the judge finds visits would harm your child.',
      ],
      ask: ['What is our strongest case for return right now?', 'If services end, what can I still do?', 'How do I keep my visits?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'This is usually the last hearing about going home.',
        'If you are 16 or older, you should have a plan for adult life covering school, work, housing, and money.',
        'You may be able to stay in foster care until 21.',
      ],
      ask: ['What happens if I cannot go home?', 'Do I have a transition plan yet?', 'Can I stay in foster care after 18?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'If the child is not returned, the court moves toward a permanent plan.',
        'Now is the time to say clearly whether you can be a long-term home.',
        'Brothers and sisters can ask the judge for visits.',
      ],
      ask: ['What would I need to do to become the guardian or adopt?', 'How long does approval take?', 'Can visits with the child\'s siblings be set up?'],
      askWho: WORKER,
    },
  },
  permanency: {
    parent: {
      goodToKnow: [
        'The judge chooses a permanent plan. The law prefers adoption first, then guardianship.',
        'Adoption ends parental rights and cannot be undone once it is final. Guardianship does not end your rights.',
        'If your life has changed, your lawyer can ask the judge to change the order using form JV-180.',
      ],
      ask: ['Which plan is the county recommending?', 'Is there a reason adoption should not be the plan in my case?', 'Can we ask for guardianship or a post-adoption contact agreement?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'The judge picks a long-term plan: adoption, guardianship, staying with a relative, or staying in foster care.',
        'If you are 12 or older, you cannot be adopted unless you agree. If you do not want your parents\' rights ended, tell your lawyer.',
        'You can ask to keep seeing your brothers and sisters. After an adoption, visits happen only if your adoptive parents agree.',
      ],
      ask: ['What does each plan mean for seeing my family?', 'Can I say no to adoption?', 'Will I stay in the same home and school?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'A relative guardian may get monthly Kin-GAP payments. Families who adopt may get adoption assistance.',
        'Guardianship does not end the parents\' rights. Adoption does.',
        'A tribal customary adoption is possible for a Native American child and does not end the parents\' rights.',
      ],
      ask: ['Which plan fits our family best?', 'What payments and health coverage come with each plan?', 'What contact will the child have with their parents?'],
      askWho: WORKER,
    },
  },
  'review-hearings': {
    parent: {
      goodToKnow: [
        'The court checks in every six months for as long as the case stays open.',
        'If your rights were not ended, you can still take part and ask for visits.',
        'If your rights were ended, you no longer get notice of these hearings.',
      ],
      ask: ['Can my visits increase?', 'Has anything changed that lets us ask the judge to change the plan?', 'What would it take to close the case?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'The judge still checks on you every six months.',
        'You can ask for changes at any time through your lawyer.',
        'At 14, your case plan must list help to get you ready to be an adult. At 16, you get your own written plan and can join the Independent Living Program.',
      ],
      ask: ['Is my plan still the right one for me?', 'Can I see more of my family?', 'What help can I get to get ready for being an adult?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'The judge checks that the child is getting what they need and that the plan is still right.',
        'You can keep telling the judge how the child is doing with form JV-290.',
        'Ask about services before problems grow.',
      ],
      ask: ['Is there anything the child needs that we do not have yet?', 'When could the case close?', 'What changes for us when it does?'],
      askWho: WORKER,
    },
  },
  'case-closure': {
    parent: {
      goodToKnow: [
        'When the case closes, the county and the court step out of your family\'s life.',
        'If you and the other parent live apart, the judge makes a custody order that stays in effect.',
        'Later changes to that order are made in family court.',
      ],
      ask: ['Can I have a copy of the final orders?', 'What exactly does the custody order say about visits and decisions?', 'What should I do if a new problem comes up?'],
      askWho: LAWYER,
    },
    youth: {
      goodToKnow: [
        'Before you leave care, you must get your documents: birth certificate, Social Security card, ID, and your health and school records.',
        'You may be able to stay in, or come back to, foster care until 21.',
        'If you were in foster care at 18, you can keep Medi-Cal health coverage until 26, no matter how much you earn.',
      ],
      ask: ['What papers do I get before I leave?', 'Can I stay in extended foster care?', 'Who do I call if I need help later?'],
      askWho: LAWYER,
    },
    supporter: {
      goodToKnow: [
        'When the case closes, the county is no longer involved.',
        'If you are the guardian, keep your court papers. Schools and doctors will ask for them.',
        'Support payments may continue after the case closes. Ask before it does.',
      ],
      ask: ['Which payments and services continue after closing?', 'What papers do I need to keep?', 'Who do I call if something changes?'],
      askWho: WORKER,
    },
  },
}
