import { MultiMod, ToggleMod } from '@/ts/game/settings/ref/i/game.settings.ref.i.mod';
import { ModDetail } from '@/ts/page/i/page.i.mod-detail';

export function convertModToModDetail(mods: (ToggleMod | MultiMod)[]): ModDetail[] {
    return mods.map((mod): ModDetail => {
        if ('enabled' in mod) {
            return {
                abr: mod.abr,
                type: 'toggle',
                enabled: mod.enabled,
            };
        }
        else {
            return {
                abr: mod.abr[mod.modValues.indexOf(mod.selected)],
                type: 'multi',
            };
        }
    }).filter((mod) => mod.type === 'toggle' ? mod.enabled === true : true);
}

export function getModIconPath(icon: string) {
    return require(`@/img/mods/${icon}`);
}