import React from 'react';
import { Villain, Action, Attribute } from '../types';

interface Props {
  villain: Villain;
}

const StatBox = ({ label, attr }: { label: string; attr: Attribute }) => (
  <div className="flex flex-col items-center p-2">
    <span className="font-bold text-dragon-red uppercase text-sm tracking-wide">{label}</span>
    <span className="text-xl font-serif font-bold text-slate-900">{attr.score}</span>
    <span className="text-sm font-sans text-slate-600">({attr.mod >= 0 ? '+' : ''}{attr.mod})</span>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-dragon-red font-display font-bold text-lg border-b-2 border-dragon-red mb-2 mt-4 uppercase tracking-widest">
    {title}
  </h3>
);

const PropertyLine = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="text-slate-800 text-sm mb-1 leading-snug">
    <span className="font-bold text-dragon-dark mr-1">{label}</span>
    <span>{value}</span>
  </div>
);

const ActionBlock: React.FC<{ action: Action }> = ({ action }) => (
  <div className="mb-3 text-sm text-slate-800">
    <span className="font-bold italic font-serif text-slate-900 mr-1">{action.name}.</span>
    {action.isAttack && (
      <span className="mr-1">
        {action.attackBonus ? `Attack Bonus: ${action.attackBonus}. ` : ''}
        {action.damage ? `Hit: ${action.damage}. ` : ''}
      </span>
    )}
    <span dangerouslySetInnerHTML={{__html: action.desc}} />
  </div>
);

export const VillainDisplay: React.FC<Props> = ({ villain }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-parchment-200 border-4 border-double border-slate-700 shadow-2xl p-6 md:p-10 font-sans text-slate-900 overflow-hidden relative">
      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-dragon-red opacity-50"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-dragon-red opacity-50"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-dragon-red opacity-50"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-dragon-red opacity-50"></div>

      {/* Identity */}
      <div className="mb-4">
        <h1 className="text-4xl font-display font-black text-dragon-dark uppercase tracking-wider leading-none">
          {villain.identity.name}
        </h1>
        <p className="text-slate-700 italic font-serif text-lg mt-1">
          {villain.identity.race}, {villain.identity.class}, {villain.identity.alignment}
        </p>
        <p className="text-sm text-slate-600 uppercase font-bold tracking-widest mt-2">
          {villain.identity.role} • ND {villain.identity.cr}
        </p>
      </div>

      <div className="stat-block-divider"></div>

      {/* Core Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
        <div>
           <PropertyLine label="Classe de Armadura" value={villain.stats.ac} />
           <PropertyLine label="Pontos de Vida" value={villain.stats.hp} />
           <PropertyLine label="Deslocamento" value="9m (padrão, ajustar se necessário)" />
        </div>
      </div>

      <div className="stat-block-divider"></div>

      {/* Attributes */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 my-4 bg-parchment-300/50 rounded-lg">
        <StatBox label="FOR" attr={villain.stats.str} />
        <StatBox label="DES" attr={villain.stats.dex} />
        <StatBox label="CON" attr={villain.stats.con} />
        <StatBox label="INT" attr={villain.stats.int} />
        <StatBox label="SAB" attr={villain.stats.wis} />
        <StatBox label="CAR" attr={villain.stats.cha} />
      </div>

      <div className="stat-block-divider"></div>

      {/* Proficiencies & Skills */}
      <div className="mb-6 space-y-1">
        {villain.stats.proficiencies.length > 0 && (
          <PropertyLine label="Perícias/Testes" value={villain.stats.proficiencies.join(', ')} />
        )}
        <PropertyLine label="Sentidos" value={villain.stats.senses.join(', ') || "Passiva Percepção 10"} />
        <PropertyLine label="Idiomas" value={villain.stats.languages.join(', ') || "Comum"} />
        {villain.stats.resistances && villain.stats.resistances.length > 0 && (
            <PropertyLine label="Resistências" value={villain.stats.resistances.join(', ')} />
        )}
      </div>

      {/* Unique Abilities */}
      {villain.uniqueAbilities.length > 0 && (
        <div className="mb-6">
          {villain.uniqueAbilities.map((ability, idx) => (
             <ActionBlock key={idx} action={{...ability, isAttack: false}} />
          ))}
        </div>
      )}

      {/* Spells */}
      {villain.spells && (
        <div className="mb-6 p-4 bg-parchment-100 border border-parchment-300 rounded">
          <h4 className="font-bold text-dragon-dark mb-2">Conjurador</h4>
          <p className="text-sm mb-2">
            <strong>Habilidade:</strong> {villain.spells.castingAbility} | 
            <strong> CD:</strong> {villain.spells.dc} | 
            <strong> Ataque:</strong> +{villain.spells.attackBonus}
          </p>
          <div className="space-y-1">
            {villain.spells.spellList.map((level, idx) => (
              <p key={idx} className="text-sm">
                <span className="italic font-bold text-slate-700">{level.level} {level.slots ? `(${level.slots} espaços)` : ''}: </span>
                <span>{level.list.join(', ')}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <SectionHeader title="Ações" />
      <div className="mb-6">
        {villain.actions.map((action, idx) => (
          <ActionBlock key={idx} action={action} />
        ))}
      </div>

      {/* Legendary Actions */}
      {villain.legendaryActions && villain.legendaryActions.length > 0 && (
        <>
          <SectionHeader title="Ações Lendárias" />
          <p className="text-sm text-slate-800 mb-2 italic">O vilão pode realizar 3 ações lendárias, escolhidas das opções abaixo. Apenas uma opção pode ser usada por vez e somente no final do turno de outra criatura. O vilão recupera as ações lendárias gastas no início do turno dele.</p>
          <div className="mb-6">
            {villain.legendaryActions.map((action, idx) => (
              <ActionBlock key={idx} action={action} />
            ))}
          </div>
        </>
      )}
      
       {/* Lair Actions */}
       {villain.lairActions && villain.lairActions.length > 0 && (
        <>
          <SectionHeader title="Ações de Covil" />
          <div className="mb-6">
            {villain.lairActions.map((action, idx) => (
              <ActionBlock key={idx} action={action} />
            ))}
          </div>
        </>
      )}

      {/* Roleplay & Lore Section (Grid for aesthetics) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 border-t-4 border-dragon-dark pt-6">
        <div>
          <h3 className="text-dragon-dark font-display font-bold text-lg mb-3 uppercase">Personalidade</h3>
          <div className="space-y-3 text-sm text-slate-800">
            <p><strong>Comportamento:</strong> {villain.personality.behavior}</p>
            <p><strong>Aparência:</strong> {villain.personality.appearance}</p>
            <p><strong>Voz/Maneirismos:</strong> {villain.personality.voice}, {villain.personality.mannerisms}</p>
            <p><strong>Em Combate:</strong> {villain.personality.combatStyle}</p>
          </div>
        </div>

        <div>
           <h3 className="text-dragon-dark font-display font-bold text-lg mb-3 uppercase">Ganchos de Aventura</h3>
           <ul className="list-disc list-inside space-y-2 text-sm text-slate-800">
             {villain.hooks.map((hook, idx) => (
               <li key={idx}>{hook}</li>
             ))}
           </ul>
        </div>
      </div>

      {/* Variants */}
      <div className="mt-8 bg-slate-900 text-slate-200 p-4 rounded-lg shadow-inner">
        <h4 className="text-yellow-500 font-display font-bold text-md mb-2 uppercase text-center border-b border-yellow-500/30 pb-2">Variantes de Poder</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-green-400 block mb-1">Versão Mais Fraca:</strong>
            <p className="opacity-90">{villain.variants.weaker}</p>
          </div>
          <div>
            <strong className="text-red-500 block mb-1">Forma Final / Mais Forte:</strong>
            <p className="opacity-90">{villain.variants.stronger}</p>
          </div>
        </div>
      </div>
    </div>
  );
};