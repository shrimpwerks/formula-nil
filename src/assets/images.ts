// Auto-generated image imports for inlining
import alea from '../../images/alea.png';
import brett from '../../images/brett.png';
import cooper from '../../images/cooper.png';
import grace from '../../images/grace.png';
import heather from '../../images/heather.png';
import john from '../../images/john.png';
import lance from '../../images/lance.png';
import nick from '../../images/nick.png';
import placeholder from '../../images/placeholder.png';
import rhett from '../../images/rhett.png';
import shane from '../../images/shane.png';
import tristan from '../../images/tristan.png';
import trevor from '../../images/trevor.png';
import trung from '../../images/trung.png';
import ty from '../../images/ty.png';

export const images: Record<string, string> = {
  'alea.png': alea,
  'brett.png': brett,
  'cooper.png': cooper,
  'grace.png': grace,
  'heather.png': heather,
  'john.png': john,
  'lance.png': lance,
  'nick.png': nick,
  'placeholder.png': placeholder,
  'rhett.png': rhett,
  'shane.png': shane,
  'tristan.png': tristan,
  'trevor.png': trevor,
  'trung.png': trung,
  'ty.png': ty,
};

export function getImage(filename: string): string {
  return images[filename] || images['placeholder.png'];
}