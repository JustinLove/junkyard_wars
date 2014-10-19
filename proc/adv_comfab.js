var fragments = require('./fragments')

module.exports = function(media) {
  return {
    adv_comfab: {
      src: [
        'pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv.json',
        'pa/units/commanders/base_commander/base_commander.json'
      ],
      cwd: media,
      dest: 'pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv.json',
      process: function(acf, com) {
        delete acf.atrophy_rate
        delete acf.atrophy_cool_down
        delete acf.guard_layer
        acf.buildable_types = com.buildable_types + " | Defense & FabBuild | Recon & FabBuild"
        acf.command_caps.push('ORDER_Attack')
        acf.description = "The combat fabricator is fully armored and armed to provide build support in heavy fire situations."
        acf.max_health = com.max_health
        acf.navigation = com.navigation
        acf.events.fired = {
          "effect_spec": "/pa/effects/specs/default_muzzle_flash.pfx socket_muzzleFront"
        }
        acf.tools = com.tools.filter(function(tool) {
          if (tool.spec_id == "/pa/tools/commander_build_arm/commander_build_arm.json") {
            tool.aim_bone = 'bone_turretBack'
            tool.muzzle_bone = 'socket_muzzleBack'
            tool.record_index = 0
          } else {
            tool.aim_bone = 'bone_turretFront'
            tool.muzzle_bone = 'socket_muzzleFront'
            tool.record_index = 1
          }

          return tool.spec_id != '/pa/tools/uber_cannon/uber_cannon.json'
        })
        return acf
      }
    },
    adv_comfab_anim: {
      targets: [
        'pa/anim/anim_trees/fabrication_bot_combat_adv_anim_tree.json'
      ],
      process: function(spec) {
        var bt = spec.skeleton_controls[0]
        bt.child.weapon_index = 0

        var ft = fragments.dup(bt)
        ft.child.rotation_bone = 'bone_turretFront'
        ft.child.weapon_index = 1
        spec.skeleton_controls.push(ft)

        var bp = spec.skeleton_controls[1]
        bp.child.weapon_index = 0

        var fr = fragments.dup(bp)
        fr.child.rotation_bone = 'bone_recoil'
        fr.child.weapon_index = 1
        spec.skeleton_controls.push(ft)
      }
    }
  }
}
