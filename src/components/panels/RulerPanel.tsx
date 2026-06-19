// 放置帝国 - 统治者面板
import { useGameStore } from '@/store/gameStore';
import { RULER_SKILLS, HEIR_EDUCATIONS, RULER_TRAITS, getEquipmentById } from '@/game/data/rulers';
import { calculateRulerLifespan, checkRulerDeath, upgradeRulerSkill } from '@/game/systems/dynastySystem';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion } from 'framer-motion';
import type { RulerSkillBranch } from '@/game/types';

const SKILL_BRANCHES: RulerSkillBranch[] = ['leadership', 'strategy', 'governance', 'charisma', 'arcane'];

export function RulerPanel() {
  const ruler = useGameStore((state) => state.ruler);
  const resources = useGameStore((state) => state.resources);
  const playTime = useGameStore((state) => state.playTime);
  const educateHeir = useGameStore((state) => state.educateHeir);
  const succeedRuler = useGameStore((state) => state.succeedRuler);
  const gameState = useGameStore.getState();

  const lifespan = calculateRulerLifespan(gameState);
  const isDead = checkRulerDeath(gameState) || !ruler.isAlive;
  const reignYears = Math.floor((playTime - ruler.reignStart) / 480);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display text-royal-300 flex items-center gap-2">
        <span>👑</span> 统治者
      </h2>

      {/* 统治者信息卡 */}
      <div className="game-panel p-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-4xl shadow-lg">
            {isDead ? '⚰️' : '👑'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-display text-royal-200">{ruler.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-ancient-700 text-ancient-200">
                第{ruler.dynastyCount + 1}代
              </span>
              {isDead && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-900 text-red-200">
                  已驾崩
                </span>
              )}
            </div>
            <div className="text-sm text-ancient-300 mb-2">
              年龄 {ruler.age} 岁 / 寿命 {lifespan} 年 · 在位 {reignYears} 年
            </div>

            {/* 属性条 */}
            <div className="space-y-1.5">
              <ProgressBar
                label="体力"
                value={ruler.stamina}
                max={100}
                showPercent
                color="red"
                height="sm"
              />
              <ProgressBar
                label="智力"
                value={ruler.intelligence}
                max={100}
                showPercent
                color="blue"
                height="sm"
              />
              <ProgressBar
                label="魅力"
                value={ruler.charisma}
                max={100}
                showPercent
                color="purple"
                height="sm"
              />
              <ProgressBar
                label="寿命"
                value={ruler.age}
                max={lifespan}
                showPercent
                color="gold"
                height="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 死亡提示 - 选择继承人 */}
      {isDead && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="game-panel p-4 border-2 border-red-500/50"
        >
          <h3 className="text-lg font-display text-red-300 mb-3">⚠️ 选择继承人</h3>
          {ruler.heirs.length === 0 ? (
            <p className="text-ancient-300">没有继承人！帝国将陷入混乱。请等待转生。</p>
          ) : (
            <div className="space-y-2">
              {ruler.heirs.map((heir) => {
                const edu = HEIR_EDUCATIONS[heir.education];
                const traits = heir.traits
                  .map((t) => RULER_TRAITS.find((tr) => tr.id === t))
                  .filter(Boolean);
                return (
                  <div key={heir.id} className="flex items-center justify-between bg-ancient-800/50 p-3 rounded">
                    <div>
                      <div className="font-medium text-royal-200">{heir.name} ({heir.age}岁)</div>
                      <div className="text-xs text-ancient-300">
                        {edu.icon} {edu.name} · 潜力 {Math.floor(heir.potential * 100)}%
                      </div>
                      <div className="text-xs text-ancient-400">
                        特质：{traits.map((t) => t?.name).join('、') || '无'}
                      </div>
                    </div>
                    <button
                      className="game-button"
                      onClick={() => succeedRuler(heir.id)}
                    >
                      继承王位
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* 技能树 */}
      {!isDead && (
        <div className="game-panel p-4">
          <h3 className="text-lg font-display text-royal-300 mb-3">📜 技能树</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SKILL_BRANCHES.map((branch) => {
              const skill = RULER_SKILLS[branch];
              const level = ruler.skills[branch];
              const cost = level * 100;
              const canUpgrade = level < skill.maxLevel && resources.knowledge >= cost;
              return (
                <div key={branch} className="bg-ancient-800/50 p-3 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="font-medium text-royal-200">{skill.name}</span>
                    </div>
                    <span className="text-sm text-ancient-300">Lv.{level}/{skill.maxLevel}</span>
                  </div>
                  <p className="text-xs text-ancient-400 mb-2">{skill.effect}</p>
                  <ProgressBar value={level} max={skill.maxLevel} color="gold" height="sm" />
                  <button
                    className={`game-button w-full mt-2 text-sm ${!canUpgrade ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!canUpgrade}
                    onClick={() => upgradeRulerSkill(branch)}
                  >
                    {level >= skill.maxLevel ? '已满级' : `升级 (📜${cost})`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 装备 */}
      {!isDead && (
        <div className="game-panel p-4">
          <h3 className="text-lg font-display text-royal-300 mb-3">⚔️ 装备</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['crown', 'weapon', 'robe', 'seal'] as const).map((slot) => {
              const equipId = ruler.equipment[slot];
              const def = equipId ? getEquipmentById(equipId) : undefined;
              const slotNames = { crown: '王冠', weapon: '宝剑', robe: '龙袍', seal: '玉玺' };
              return (
                <div key={slot} className="bg-ancient-800/50 p-3 rounded text-center">
                  <div className="text-xs text-ancient-400 mb-1">{slotNames[slot]}</div>
                  <div className="text-3xl mb-1">{def?.icon || '🔲'}</div>
                  <div className="text-xs font-medium text-royal-200">{def?.name || '空'}</div>
                  {def && (
                    <div className="text-xs text-ancient-300 mt-1">
                      {Object.entries(def.bonus).map(([k, v]) => `+${v} ${k}`).join(' ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 继承人 */}
      {!isDead && (
        <div className="game-panel p-4">
          <h3 className="text-lg font-display text-royal-300 mb-3">👶 继承人</h3>
          {ruler.heirs.length === 0 ? (
            <p className="text-ancient-300 text-sm">
              {ruler.age < 20 ? '统治者尚年轻，暂无继承人' : '暂无继承人，时间流逝会自然产生'}
            </p>
          ) : (
            <div className="space-y-2">
              {ruler.heirs.map((heir) => {
                const edu = HEIR_EDUCATIONS[heir.education];
                const traits = heir.traits
                  .map((t) => RULER_TRAITS.find((tr) => tr.id === t))
                  .filter(Boolean);
                return (
                  <div key={heir.id} className="flex items-center justify-between bg-ancient-800/50 p-3 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-royal-200">{heir.name} ({heir.age}岁)</div>
                      <div className="text-xs text-ancient-300 mb-1">
                        {edu.icon} {edu.name} · 潜力 {Math.floor(heir.potential * 100)}%
                      </div>
                      <div className="text-xs text-ancient-400 mb-1">
                        特质：{traits.map((t) => t?.name).join('、') || '无'}
                      </div>
                      <ProgressBar
                        label="教育进度"
                        value={heir.educationProgress}
                        max={1}
                        showPercent
                        color="blue"
                        height="sm"
                      />
                    </div>
                    <button
                      className="game-button ml-3 text-sm"
                      onClick={() => educateHeir(heir.id)}
                    >
                      培养
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
