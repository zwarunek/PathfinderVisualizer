import {animation, style, animate, trigger, transition, useAnimation, keyframes} from '@angular/animations';
import {Colors} from './colors';
import {colors} from '@angular/cli/utilities/color';


export const gridSquareTrigger = trigger('gridSquare', [
  transition((fromState, toState) =>
  {
    return fromState.startsWith('blank') && toState.startsWith('wall');
  },  [
    animate('0.3s', keyframes([
      style({'z-index': 100,
        transform: 'matrix(.01, 0, 0, .01, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 0}),
      style({'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 1})
    ]))
  ]),
  transition((fromState, toState) =>
  {
    return fromState.startsWith('wall') && toState.startsWith('blank');
  },   [
    animate('0.3s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(.01, 0, 0, .01, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 1
      })
    ]))
  ]),
  transition((fromState, toState) =>
  {
    return fromState.startsWith('searched') && toState.startsWith('wall');
  },   [
    animate('0.3s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(.01, 0, 0, .01, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 1
      })
    ]))
  ]),
  transition((fromState, toState) =>
  {
    return fromState === 'blank grid-show' && toState === 'searched grid-show';
  }, [
    animate('1s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.searchColorDark,
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': 'red',
        offset: .5
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.searchColor,
        offset: 1
      })
    ]))
  ]),
  transition((fromState, toState) =>
  {
    return fromState === 'blank grid-hide' && toState === 'searched grid-hide';
  }, [
    animate('1s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.searchColorDark,
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.searchColorDark,
        offset: .5
      }),
      style({
        'z-index': 100,
        'background-color': Colors.searchColor,
        offset: 1
      })
    ]))
  ])
]);

export const gridHexTrigger = trigger('gridHex', [
  transition('blank => wall', [
    animate('0.5s', keyframes([
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(0deg)',
        'background-color': Colors.background,
        offset: 0}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.background,
        offset: .5}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.wallColor,
        offset: .51}),
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(180deg)',
        'background-color': Colors.wallColor,
        offset: 1})
    ]))
  ]),
  transition('wall => blank', [
    animate('0.5s', keyframes([
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(0deg)',
        'background-color': Colors.wallColor,
        offset: 0}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.wallColor,
        offset: .5}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.background,
        offset: .51}),
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(180deg)',
        'background-color': Colors.background,
        offset: 1})
    ]))
  ]),
  transition('searched => wall', [
    animate('0.5s', keyframes([
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(0deg)',
        'background-color': Colors.searchColor,
        offset: 0}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.searchColor,
        offset: .5}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.wallColor,
        offset: .51}),
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(180deg)',
        'background-color': Colors.wallColor,
        offset: 1})
    ]))
  ]),
  transition('wall => searched', [
    animate('0.5s', keyframes([
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(0deg)',
        'background-color': Colors.wallColor,
        offset: 0}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.wallColor,
        offset: .5}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.searchColor,
        offset: .51}),
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(180deg)',
        'background-color': Colors.searchColor,
        offset: 1})
    ]))
  ]),
  transition('blank => searched', [
    animate('1s', keyframes([
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(0deg)',
        'background-color': Colors.background,
        offset: 0}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.background,
        offset: .25}),
      style({
        transform: 'matrix(.01, 0, 0, .01, 0, 0) rotate(90deg)',
        'background-color': Colors.searchColorDark,
        offset: .26}),
      style({
        transform: 'matrix(.95, 0, 0, .95, 0, 0) rotate(180deg)',
        'background-color': Colors.searchColor,
        offset: 1})
    ]))
  ])
]);
