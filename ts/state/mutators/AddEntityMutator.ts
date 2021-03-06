'use strict';

import Immutable = require('immutable');
import GameState = require('../GameState');
import GameStateMutator = require('../GameStateMutator');
import Entity = require('../../Entity');

class AddEntityMutator implements GameStateMutator {
	constructor(public entity:Entity) {
	}

	public applyTo(state:GameState):GameState {
		var newEntity = this.entity;
		if (!this.entity) {
			console.error('Cannot add null entity');
			return state;
		}

		var id = +this.entity.getId();
		if (id < 1) {
			console.error('Cannot add entity: Invalid entity id');
			return state;
		}

		var entities = state.getEntities();
		if (entities.has(id)) {
			console.warn('Overwriting entity with id #' + id);
			// we might have a stale entity at the old location in the entity tree
		}

		entities = entities.set(id, this.entity);

		var entityTree = state.getEntityTree();
		entityTree = entityTree.setIn([this.entity.getController(), this.entity.getZone(), id], this.entity);

		// we always mutate the GameState when we add an entity
		return new GameState(entities, entityTree, state.getOptions(), state.getOptionTree());
	}
}

export = AddEntityMutator;