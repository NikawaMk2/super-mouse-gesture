import { describe, it, expect, beforeEach } from 'vitest';
import { DirectionTrail } from '@/content/gestures/models/direction_trail';
import { GestureDirection } from '@/shared/types/gesture-direction';

describe('DirectionTrail', () => {
    let trail: DirectionTrail;

    beforeEach(() => {
        trail = new DirectionTrail();
    });

    describe('add', () => {
        it('履歴が空の場合_方向を追加すること', () => {
            trail.add(GestureDirection.UP);

            expect(trail.isEmpty()).toBe(false);
        });

        it('履歴に1つ方向がある場合_異なる方向を追加すると追加されること', () => {
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.DOWN);

            expect(trail.isEmpty()).toBe(false);
        });

        it('履歴に1つ方向がある場合_同じ方向を追加すると追加されないこと', () => {
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.UP);

            expect(trail.isEmpty()).toBe(false);
        });

        it('複数の異なる方向を追加する場合_正しく追加されること', () => {
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.RIGHT);
            trail.add(GestureDirection.DOWN);
            trail.add(GestureDirection.LEFT);

            expect(trail.isEmpty()).toBe(false);
        });

        it('同じ方向が連続する場合_最初の1つのみが追加されること', () => {
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.UP);

            expect(trail.isEmpty()).toBe(false);
        });

        it('異なる方向を交互に追加する場合_全て追加されること', () => {
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.DOWN);
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.DOWN);

            expect(trail.isEmpty()).toBe(false);
        });
    });

    describe('isEmpty', () => {
        it('履歴が空の場合_trueを返すこと', () => {
            expect(trail.isEmpty()).toBe(true);
        });

        it('履歴に要素がある場合_falseを返すこと', () => {
            trail.add(GestureDirection.UP);

            expect(trail.isEmpty()).toBe(false);
        });

        it('複数の要素がある場合_falseを返すこと', () => {
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.DOWN);

            expect(trail.isEmpty()).toBe(false);
        });
    });

    describe('reset', () => {
        it('リセット後_履歴が空になること', () => {
            trail.add(GestureDirection.UP);
            trail.add(GestureDirection.DOWN);
            trail.reset();

            expect(trail.isEmpty()).toBe(true);
        });

        it('リセット後_isEmptyがtrueを返すこと', () => {
            trail.add(GestureDirection.UP);
            trail.reset();

            expect(trail.isEmpty()).toBe(true);
        });

        it('空の状態でリセットした場合_空のままであること', () => {
            trail.reset();

            expect(trail.isEmpty()).toBe(true);
        });
    });
});
