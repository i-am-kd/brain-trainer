import {describe, it, expect} from 'vitest';
import { calculateScore } from './scoring';

describe("calculateScore", () =>{
    it('should return 0 if incorrect', () =>{
        expect(calculateScore(false, 'easy', 1000)).toBe(0);
        expect(calculateScore(false, 'hard', 1000)).toBe(0)
    });

    it("should reutrn base score for easy difficulty with slow time", ()=>{
        const score = calculateScore(true, 'easy', 35000);
        expect(score).toBe(15);
    });

    it("should return base score+max bonus for fast completion", () =>{
        const score = calculateScore (true, 'medium', 4000);
        expect(score).toBe(45)
    });

    it('should return base score + partial bonus for medium time', () =>{
        const score = calculateScore(true, 'hard', 17500);
        expect(score).toBe(75);
    });
});