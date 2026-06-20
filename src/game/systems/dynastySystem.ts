// 放置帝国 - 王朝继承系统
import { useGameStore } from '@/store/gameStore';
import { RULER_BASE_LIFESPAN, RULER_MAX_LIFESPAN, HEIR_NAMES } from '@/utils/constants';
import { RULER_SKILLS, RULER_EQUIPMENT, RULER_TRAITS, getEquipmentById } from '@/game/data/rulers';
import type { GameState, RulerSkillBranch, HeirState, ResourceState } from '@/game/types';

// 计算统治者寿命（基础60年 + 科技加成 + 奇观加成 + 转生加成）
export function calculateRulerLifespan(state: GameState): number {
  let lifespan = RULER_BASE_LIFESPAN;

  // 科技加成：医学相关科技每项+3年
  const medicalTechs = ['biotech', 'geneticEngineering', 'mindUpload'];
  medicalTechs.forEach((tech) => {
    if (state.tech.researched.includes(tech)) {
      lifespan += 3;
    }
  });

  // 奇观加成：某些奇观延长寿命
  const lifeWonders = ['pyramid', 'timeMachine'];
  state.wonders.forEach((w) => {
    if (w.built && lifeWonders.includes(w.defId)) {
      lifespan += 5;
    }
  });

  // 转生加成：每次转生+1年
  lifespan += state.rebirth.totalRebirths;

  // 统治者治理技能加成：每级+0.5年
  lifespan += state.ruler.skills.governance * 0.5;

  return Math.min(lifespan, RULER_MAX_LIFESPAN);
}

// 检查统治者是否死亡
export function checkRulerDeath(state: GameState): boolean {
  if (!state.ruler.isAlive) return true;
  const lifespan = calculateRulerLifespan(state);
  if (state.ruler.age >= lifespan) return true;
  // 高龄随机死亡风险（超过寿命80%后每tick有微小概率）
  if (state.ruler.age >= lifespan * 0.8) {
    return Math.random() < 0.0001; // 极低概率
  }
  return false;
}

// 生成新继承人
export function generateHeir(state: GameState): HeirState {
  const name = HEIR_NAMES[Math.floor(Math.random() * HEIR_NAMES.length)];
  // 潜力受统治者魅力影响（魅力越高继承人潜力越高）
  const charismaBonus = state.ruler.charisma / 200; // 0-0.5
  const potential = Math.min(1.0, 0.3 + Math.random() * 0.5 + charismaBonus);
  // 随机1-2个特质
  const traitCount = Math.random() < 0.4 ? 2 : 1;
  const shuffled = [...RULER_TRAITS].sort(() => Math.random() - 0.5);
  const traits = shuffled.slice(0, traitCount).map((t) => t.id);

  // 随机教育方向
  const educations = ['military', 'civic', 'diplomacy', 'academic'] as const;
  const education = educations[Math.floor(Math.random() * educations.length)];

  return {
    id: `heir_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    age: Math.floor(Math.random() * 10) + 5, // 5-15岁
    education,
    educationProgress: 0,
    traits,
    potential,
  };
}

// 获取技能加成百分比（0-1）
export function getRulerSkillBonus(state: GameState, branch: RulerSkillBranch): number {
  const level = state.ruler.skills[branch];
  const skillDef = RULER_SKILLS[branch];
  return level * skillDef.bonusPerLevel;
}

// 获取装备总加成
export function getRulerEquipmentBonus(state: GameState): Partial<ResourceState> {
  const bonus: Partial<ResourceState> = {};
  const equipment = state.ruler.equipment;

  Object.values(equipment).forEach((equipId) => {
    if (!equipId) return;
    const def = getEquipmentById(equipId);
    if (!def) return;
    Object.entries(def.bonus).forEach(([key, value]) => {
      const resKey = key as keyof ResourceState;
      bonus[resKey] = (bonus[resKey] || 0) + (value || 0);
    });
  });

  return bonus;
}

// 获取统治者对全产出的加成倍数
export function getRulerProductionMultiplier(state: GameState): number {
  // 领导技能加成
  const leadershipBonus = getRulerSkillBonus(state, 'leadership');
  // 体力影响（体力越高产出越高，体力<30时产出下降）
  const staminaFactor = state.ruler.stamina < 30 ? 0.7 : 1.0;
  return 1 + leadershipBonus * staminaFactor;
}

// 获取统治者对战斗的加成倍数
export function getRulerCombatMultiplier(state: GameState): number {
  const strategyBonus = getRulerSkillBonus(state, 'strategy');
  return 1 + strategyBonus;
}

// 获取统治者对科技速度的加成倍数
export function getRulerTechMultiplier(state: GameState): number {
  const arcaneBonus = getRulerSkillBonus(state, 'arcane');
  return 1 + arcaneBonus;
}

// 获取统治者对文化值的加成倍数
export function getRulerCultureMultiplier(state: GameState): number {
  const charismaBonus = getRulerSkillBonus(state, 'charisma');
  return 1 + charismaBonus;
}

// 更新统治者年龄（每tick调用）
export function updateRulerAge(deltaSeconds: number): void {
  // deltaSeconds秒 ≈ 1天（tick=1秒，1年=365天）
  const days = Math.floor(deltaSeconds);
  if (days > 0) {
    useGameStore.getState().ageRuler(days);
  }
}

// 检查并处理统治者死亡（返回是否死亡）
export function processRulerDeath(): boolean {
  const state = useGameStore.getState();
  if (!checkRulerDeath(state)) return false;

  // 标记死亡
  useGameStore.setState((s) => ({
    ruler: { ...s.ruler, isAlive: false },
  }));

  // 合法性下降
  useGameStore.getState().modifyLegitimacy(-15, '统治者驾崩');

  // 记录编年史
  useGameStore.getState().recordChronicle({
    category: 'politics',
    title: '统治者驾崩',
    description: `${state.ruler.name}于${state.ruler.age}岁驾崩，享国${Math.floor((state.playTime - state.ruler.reignStart) / 480)}年`,
    impact: '合法性 -15，需选择继承人',
  });

  return true;
}

// 添加继承人（每5年可生成一个）
export function tryGenerateHeir(): void {
  const state = useGameStore.getState();
  const ruler = state.ruler;
  if (!ruler.isAlive) return;
  if (ruler.age < 20) return; // 20岁前不能有继承人
  // 每5年最多生成一个，且最多3个继承人
  if (ruler.heirs.length >= 3) return;
  const lastHeirTime = ruler.heirs.length > 0
    ? Math.max(...ruler.heirs.map((h) => h.age))
    : 0;
  if (ruler.age - lastHeirTime < 5 && ruler.heirs.length > 0) return;

  const newHeir = generateHeir(state);
  useGameStore.setState((s) => ({
    ruler: { ...s.ruler, heirs: [...s.ruler.heirs, newHeir] },
  }));
}

// 升级统治者技能（消耗知识）
export function upgradeRulerSkill(branch: RulerSkillBranch): boolean {
  const state = useGameStore.getState();
  const currentLevel = state.ruler.skills[branch];
  const skillDef = RULER_SKILLS[branch];
  if (currentLevel >= skillDef.maxLevel) return false;

  const cost = currentLevel * 100; // 每级成本=当前等级*100知识
  if (state.resources.knowledge < cost) return false;

  useGameStore.getState().spendResource('knowledge', cost);
  useGameStore.getState().upgradeRulerSkill(branch);
  return true;
}

// 获取装备列表（已解锁的）
export function getUnlockedEquipment(state: GameState): typeof RULER_EQUIPMENT {
  return RULER_EQUIPMENT.filter((e) => !e.unlockTech || state.tech.researched.includes(e.unlockTech));
}
