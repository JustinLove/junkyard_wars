var fragments = require('./fragments')

var fab_range = 260

module.exports = function(media) {
  return {
    adv_comfab: {
      targets: [
        'pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv.json'
      ],
      process: function(acf) {
        delete acf.atrophy_rate
        delete acf.atrophy_cool_down
        delete acf.guard_layer
        acf.buildable_types += " | Defense & FabBuild | Recon & FabBuild"
        acf.command_caps.push('ORDER_Attack')
        acf.description = "Provides long-range auto-repair, manual-reclaim, and defense emplacements."
        acf.max_health *= 10
        acf.navigation = {
          "acceleration": 60,
          "brake": 60,
          "move_speed": 6,
          "turn_in_place": false,
          "turn_speed": 90,
          "type": "amphibious"
        },
        acf.recon.observer.items.push({
            "channel": "radar",
            "layer": "surface",
            "radius": fab_range,
            "shape": "capsule",
            "uses_energy": false
          })
        acf.events.fired = {
          "effect_spec": "/pa/effects/specs/default_muzzle_flash.pfx socket_muzzleFront"
        }
        acf.tools[0].record_index = 0
        acf.tools.push({
          spec_id: '/pa/units/land/tank_light_laser/tank_light_laser_tool_weapon.json',
          aim_bone: 'bone_turretFront',
          muzzle_bone: 'socket_muzzleFront',
          record_index: 1
        })
      }
    },
    adv_comfab_buildarm: {
      targets: [
        'pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv_build_arm.json',
      ],
      process: function(ba) {
        ba.max_range = fab_range
        ba.construction_demand = {
          metal: 30,
          energy: 3000
        }
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
