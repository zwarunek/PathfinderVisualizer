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
        transform: 'scale(01%)',
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
        transform: 'scale(01%)',
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
        transform: 'scale(01%)',
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
    animate('.5s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': 'yellow',
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.background,
        offset: .02
      }),
      style({
        'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.searchColorDark,
        offset: .05
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.searchColorDark,
        offset: .65
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
    animate('.5s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': 'yellow',
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.background,
        offset: .02
      }),
      style({
        'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.searchColorDark,
        offset: .05
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.searchColorDark,
        offset: .65
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
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
        transform: 'scale(95%) ',
        'background-color': Colors.background,
        fill: Colors.background,
        offset: 0}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.background,
        fill: Colors.background,
        offset: .5}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: .51}),
      style({
        transform: 'scale(95%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: 1})
    ]))
  ]),
  transition('wall => blank', [
    animate('0.5s', keyframes([
      style({
        transform: 'scale(95%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: 0}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: .5}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.background,
        fill: Colors.background,
        offset: .51}),
      style({
        transform: 'scale(95%) ',
        'background-color': Colors.background,
        fill: Colors.background,
        offset: 1})
    ]))
  ]),
  transition('searched => wall', [
    animate('0.5s', keyframes([
      style({
        transform: 'scale(95%) ',
        'background-color': Colors.searchColor,
        fill: Colors.searchColor,
        offset: 0}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.searchColor,
        fill: Colors.searchColor,
        offset: .5}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: .51}),
      style({
        transform: 'scale(95%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: 1})
    ]))
  ]),
  transition('wall => searched', [
    animate('0.5s', keyframes([
      style({
        transform: 'scale(95%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: 0}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.wallColor,
        fill: Colors.wallColor,
        offset: .5}),
      style({
        transform: 'scale(01%) ',
        'background-color': Colors.searchColor,
        fill: Colors.searchColor,
        offset: .51}),
      style({
        transform: 'scale(95%) ',
        'background-color': Colors.searchColor,
        fill: Colors.searchColor,
        offset: 1})
    ]))
  ]),
  transition('blank => searched', [
    animate('1s', keyframes([
      style({
        transform: 'scale(95%)',
        'background-color': Colors.background,
        fill: Colors.background,
        offset: 0}),
      style({
        transform: 'scale(01%)',
        'background-color': Colors.background,
        fill: Colors.background,
        offset: .25}),
      style({
        transform: 'scale(01%)',
        'background-color': Colors.searchColorDark,
        fill: Colors.searchColorDark,
        offset: .26}),
      style({
        transform: 'scale(95%)',
        'background-color': Colors.searchColor,
        fill: Colors.searchColor,
        offset: 1})
    ]))
  ])
]);
