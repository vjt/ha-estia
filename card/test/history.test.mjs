// Heating estimate: target above the room, or the room still rising right after.
import assert from "node:assert/strict";
import { test } from "node:test";

import { HEATING_RISE_C_PER_H, RISE_WINDOW_MS, heatingBands, riseRate, sampleAt } from "../src/history.ts";

const MIN = 60_000;
const s = (minute, current, target, heat = true) => ({ t: minute * MIN, current, target, heat });
const band = (from, to) => ({ from: from * MIN, to: to * MIN });

test("the window and threshold are 60 min and 0.3 °C/h", () => {
  assert.equal(RISE_WINDOW_MS, 60 * MIN);
  assert.equal(HEATING_RISE_C_PER_H, 0.3);
});

test("sampleAt is the latest sample not after the time, null before the first", () => {
  const points = [s(0, 19, 20), s(10, 19.1, 20)];
  assert.equal(sampleAt(points, -1), null);
  assert.equal(sampleAt(points, 0), points[0]);
  assert.equal(sampleAt(points, 9 * MIN), points[0]);
  assert.equal(sampleAt(points, 10 * MIN), points[1]);
});

test("riseRate is the change over the last 60 minutes, in °C/h", () => {
  const points = [s(0, 18.5, 20), s(30, 19.0, 20), s(60, 19.4, 20)];
  assert.ok(Math.abs(riseRate(points, 60 * MIN) - 0.9) < 1e-9);
  assert.ok(Math.abs(riseRate(points, 90 * MIN) - 0.4) < 1e-9);
  assert.equal(riseRate(points, 59 * MIN), null); // nothing an hour before
  assert.equal(riseRate([s(0, null, 20), s(60, 19, 20)], 60 * MIN), null);
});

test("target above the room is heating", () => {
  const points = [s(0, 19.0, 17.2), s(30, 19.0, 20.0), s(90, 19.0, 17.2)];
  assert.deepEqual(heatingBands(points, 0, 120 * MIN), [band(30, 90)]);
});

test("the room still rising after reaching the target is heating (inertia)", () => {
  // The morning ramp (Thu 29/10): the target is reached at 30, the room keeps
  // rising; 60 min after the last rise the hour-long climb drops below 0.3 °C/h.
  const points = [
    s(-60, 18.3, 19.3),
    s(30, 19.3, 19.3),
    s(40, 19.4, 19.3),
    s(50, 19.5, 19.3),
    s(60, 19.6, 19.3),
  ];
  // At 90 the room is 0.3 above 30's; at 100, 0.2 above 40's.
  assert.deepEqual(heatingBands(points, -60 * MIN, 180 * MIN), [band(-60, 100)]);
});

test("a rise below 0.3 °C/h after the target ends the band at the target", () => {
  const points = [s(-60, 19.1, 19.3), s(0, 19.3, 19.3)];
  assert.deepEqual(heatingBands(points, -60 * MIN, 120 * MIN), [band(-60, 0)]);
});

test("a rise without heating just before is not heating (sun, oven)", () => {
  const points = [s(0, 19.3, 17.2), s(30, 19.6, 17.2), s(60, 19.8, 17.2)];
  assert.deepEqual(heatingBands(points, 0, 180 * MIN), []);
});

test("nothing is heating outside heat mode, inertia included", () => {
  const points = [s(-60, 18.3, 19.3), s(30, 19.3, 19.3), s(40, 19.5, 19.3, false)];
  assert.deepEqual(heatingBands(points, -60 * MIN, 120 * MIN), [band(-60, 40)]);
  assert.deepEqual(heatingBands([s(0, 18, 20, false)], 0, 60 * MIN), []);
});

test("bands are clipped to the period, inertia measured from before it", () => {
  const points = [s(-120, 18.3, 19.3), s(-30, 19.3, 19.3), s(-20, 19.6, 19.3)];
  // Inertia from -30 while the climb over the hour stays at 0.3 or more: at 30
  // it is 0.3 (over -30's 19.3), at 40 nothing (over -20's 19.6). Clipped to
  // the period starting at 0.
  assert.deepEqual(heatingBands(points, 0, 60 * MIN), [band(0, 40)]);
});
