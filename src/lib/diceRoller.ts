import { DiceRoller } from 'rpg-dice-roller';

export interface DiceRollResult {
  formula: string;
  result: number;
  details: {
    rolls: any[];
    modifiers: number;
  };
}

export class InfernusDiceRoller {
  private roller: DiceRoller;

  constructor() {
    this.roller = new DiceRoller();
  }

  roll(formula: string): DiceRollResult {
    try {
      const roll = this.roller.roll(formula);
      
      return {
        formula,
        result: roll.total,
        details: {
          rolls: roll.rolls,
          modifiers: roll.modifiers || 0,
        },
      };
    } catch (error) {
      throw new Error(`Erro ao rolar dados: ${error}`);
    }
  }

  // Métodos de conveniência para rolagens comuns
  rollD20(modifier: number = 0): DiceRollResult {
    const formula = modifier >= 0 ? `1d20+${modifier}` : `1d20${modifier}`;
    return this.roll(formula);
  }

  rollDamage(diceCount: number, diceType: number, modifier: number = 0): DiceRollResult {
    const formula = modifier >= 0 
      ? `${diceCount}d${diceType}+${modifier}` 
      : `${diceCount}d${diceType}${modifier}`;
    return this.roll(formula);
  }

  rollInitiative(modifier: number = 0): DiceRollResult {
    return this.rollD20(modifier);
  }

  rollSavingThrow(modifier: number = 0): DiceRollResult {
    return this.rollD20(modifier);
  }

  rollSkillCheck(modifier: number = 0): DiceRollResult {
    return this.rollD20(modifier);
  }
}

// Instância singleton
export const diceRoller = new InfernusDiceRoller();

