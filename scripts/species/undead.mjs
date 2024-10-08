import {Species} from "./species.mjs";
import {Rules} from "../common/rules.mjs";
import {ConditionalBonusSkillStep} from "../steps/conditional-bonus-skill-step.mjs";
import {AssignVulnerabilityStep} from "../steps/assign-vulnerability-step.mjs";
import {Spells} from "../common/spells.mjs";
import {CommonSkills} from "../common/skills.mjs";
import {ChooseSpellStep} from "../steps/choose-spell-step.mjs";
import {pick} from "../common/utils.mjs";

const undeadSpellList = pick(Spells.asSkills, "breath", "curse", "lifeTheft", "poison")

/**
 * @type {ConditionalBonusSkill}
 */
const undeadConditionalSkill = {
    drawback: {
        label: "QUICKNPC.species.undead.additionalVulnerability.name",
        description: "QUICKNPC.species.undead.additionalVulnerability.description",
        apply: (model, context) => {
            AssignVulnerabilityStep.addVulnerability(context, ["air", "bolt", "earth", "fire", "ice"])
        }
    },
    options: {
        upgradeImmToAbs: {
            label: "QUICKNPC.species.undead.upgradeImmToAbs.name",
            description: "QUICKNPC.species.undead.upgradeImmToAbs.description",
            apply: model => {
                model.affinities.dark.abs = true;
            }
        },
        undeadSpell: {
            label: "QUICKNPC.species.undead.spell.name",
            description: "QUICKNPC.species.undead.spell.description",
            apply: (model, context) => {
                ChooseSpellStep.addSpell(context, undeadSpellList)
                model.bonuses.mp += 10;
            }
        },
        flying: CommonSkills.flying,
        undeadAdditionalRoleSkill: CommonSkills.additionalRoleSkill
    }
}

class Undead extends Species {

    get label() {
        return "QUICKNPC.species.undead.name";
    }

    apply(model, context) {
        model.affinities.light.vul = "species";
        model.affinities.dark.imm = true;
        model.affinities.poison.imm = true;
        model.statusImmunities.poisoned = true;
        model.rules.undeadHealing = Rules.simpleRule("QUICKNPC.species.undead.undeadHealing")

        ConditionalBonusSkillStep.addConditionalBonusSkill(context, undeadConditionalSkill)
    }
}

export const undead = new Undead();
