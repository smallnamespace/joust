/// <reference path="../../typings/react/react.d.ts"/>
/// <reference path="../interfaces.d.ts"/>
import {OptionCallbackProps} from "../interfaces";
'use strict';

import React = require('react');

import Immutable = require('immutable');
import PlayerEntity = require('../Player');
import Entity = require('../Entity');
import Option = require('../Option');
import EntityList = require('./EntityList');
import Deck = require('./Deck');
import Hand = require('./Hand');
import Hero = require('./Hero');
import HeroPower = require('./HeroPower');
import Field = require('./Field');
import Weapon = require('./Weapon');
import Secrets = require('./Secrets');

import {Zone, CardType} from '../enums'

interface PlayerProps extends OptionCallbackProps, React.Props<any> {
	player: PlayerEntity;
	entities: Immutable.Map<number, Immutable.Map<number, Entity>>;
	options: Immutable.Map<number, Immutable.Map<number, Option>>;
	isTop: boolean;
}

class Player extends React.Component<PlayerProps, {}> {

	public render() {
		var filterByCardType = function (cardType:number) {
			return function (entity:Entity):boolean {
				return !!entity && entity.getCardType() === cardType;
			};
		};

		var emptyEntities = Immutable.Map<number, Entity>();
		var emptyOptions = Immutable.Map<number, Option>();

		var playEntities = this.props.entities.get(Zone.PLAY) || Immutable.Map<number, Entity>();
		var playOptions = this.props.options.get(Zone.PLAY) || Immutable.Map<number, Option>();

		/* Equipment */
		var heroEntity = playEntities.filter(filterByCardType(CardType.HERO)).first();
		var hero = <Hero entity={heroEntity}
						 option={heroEntity ? playOptions.get(heroEntity.getId()) : null}
						 secrets={this.props.entities.get(Zone.SECRET) || Immutable.Map<number, Entity>()}
						 optionCallback={this.props.optionCallback}/>;
		var heroPowerEntity = playEntities.filter(filterByCardType(CardType.HERO_POWER)).first();
		var heroPower = <HeroPower entity={heroPowerEntity}
								   option={heroPowerEntity ? playOptions.get(heroPowerEntity.getId()) : null}
								   optionCallback={this.props.optionCallback}/>;
		var weapon = <Weapon entity={playEntities.filter(filterByCardType(CardType.WEAPON)).first()}/>;

		var field = <Field entities={playEntities.filter(filterByCardType(CardType.MINION)) || emptyEntities}
						   options={playOptions || emptyOptions}
						   optionCallback={this.props.optionCallback}/>;
		var deck = <Deck entities={this.props.entities.get(Zone.DECK) || emptyEntities}
						 options={this.props.options.get(Zone.DECK) || emptyOptions}/>;
		var hand = <Hand entities={this.props.entities.get(Zone.HAND) || emptyEntities}
						 options={this.props.options.get(Zone.HAND) || emptyOptions}
						 optionCallback={this.props.optionCallback}/>;
		var name = this.props.player.getName() ? <div className="name">{this.props.player.getName()}</div> : null;

		var crystals = [];
		for (var i = 0; i < this.props.player.getResources(); i++) {
			var crystalClassNames = ['crystal'];
			if (i < (this.props.player.getResources() - this.props.player.getResourcesUsed())) {
				crystalClassNames.push('full');
			}
			else {
				crystalClassNames.push('empty');
			}
			crystals.push(<div key={i} className={crystalClassNames.join(' ')}></div>);
		}
		var resources = this.props.player.getResources();
		var available = resources - this.props.player.getResourcesUsed();
		var tray = (
			<div className="tray">
				<span>{available}/{resources}</span>
				{crystals}
			</div>
		);

		var classNames = this.props.isTop ? 'player top' : 'player';

		if (this.props.isTop) {
			return (
				<div className={classNames}>
					{hand}
					<div className="equipment">
						<div>
							{name}
						</div>
						<div></div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{tray}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{field}
				</div>
			);
		}
		else {
			return (
				<div className={classNames}>
					{field}
					<div className="equipment">
						<div>
							{name}
						</div>
						<div></div>
						<div className="middle">
							{weapon}
							{hero}
							{heroPower}
						</div>
						<div>
							{tray}
						</div>
						<div>
							{deck}
						</div>
					</div>
					{hand}
				</div>
			);
		}
	}

	public shouldComponentUpdate(nextProps:PlayerProps, nextState) {
		return (
			this.props.player !== nextProps.player ||
			this.props.entities !== nextProps.entities ||
			this.props.options !== nextProps.options ||
			this.props.optionCallback !== nextProps.optionCallback
		);
	}
}

export = Player;
