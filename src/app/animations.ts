import {animation, style, animate, trigger, transition, useAnimation, keyframes} from '@angular/animations';
import {Colors} from './colors';


export const gridSquareTrigger = trigger('gridSquare', [
  transition('blank => wall', [
    animate('0.3s', keyframes([
      style({'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 0}),
      style({'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 1})
    ]))
  ]),
  transition('wall => blank', [
    animate('0.3s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 1
      })
    ]))
  ]),
  transition('searched => wall', [
    animate('0.3s', keyframes([
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.searchColor,
        offset: 0
      }),
      style({
        'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.searchColor,
        offset: .20
      }),
      style({
        'z-index': 100,
        transform: 'matrix(.1, 0, 0, .1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: .21
      }),
      style({
        'z-index': 100,
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        'background-color': Colors.wallColor,
        offset: 1
      })
    ]))
  ])
]);

export const hexTrigger = trigger('hex', [
    transition('blank => wall', [
      animate('0.3s', keyframes([
        style({'z-index': 100,
          transform: 'matrix(.1, 0, 0, .1, 0, 0) rotate(90deg)',
          'background-color': Colors.wallColor,
          offset: 0}),
        style({'z-index': 100,
          transform: 'matrix(1, 0, 0, 1, 0, 0) rotate(90deg)',
          'background-color': Colors.wallColor,
          offset: 1})
      ]))
    ]),
    transition('wall => blank', [
      animate('0.3s', keyframes([
        style({
          'z-index': 100,
          transform: 'matrix(1, 0, 0, 1, 0, 0) rotate(90deg)',
          'background-color': Colors.wallColor,
          offset: 0
        }),
        style({
          'z-index': 100,
          transform: 'matrix(.1, 0, 0, .1, 0, 0) rotate(90deg)',
          'background-color': Colors.wallColor,
          offset: 1
        })
      ]))
    ])
  ]);
