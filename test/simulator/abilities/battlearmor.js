'use strict';

const assert = require('./../../assert');
let battle;

describe('Battle Armor', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent moves from dealing critical hits', function () {
		battle = BattleEngine.Battle.construct('battle-battlearmor', 'customgame');
		battle.join('p1', 'Guest 1', 1, [{species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cyrogonal', ability: 'noguard', moves: ['frostbreath']}]);
		battle.commitDecisions(); // Team Preview
		let successfulEvent = false;
		battle.on('ModifyDamage', battle.getFormat(), function (damage, attacker, defender, move) {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert.ok(!move.crit);
			}
		});
		battle.commitDecisions();
		assert.ok(successfulEvent);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct('battle-battlearmor-moldbreaker', 'customgame');
		battle.join('p1', 'Guest 1', 1, [{species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cyrogonal', ability: 'moldbreaker', item: 'zoomlens', moves: ['frostbreath']}]);
		battle.commitDecisions(); // Team Preview
		let successfulEvent = false;
		battle.on('ModifyDamage', battle.getFormat(), function (damage, attacker, defender, move) {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert.ok(move.crit);
			}
		});
		battle.commitDecisions();
		assert.ok(successfulEvent);
	});
});
