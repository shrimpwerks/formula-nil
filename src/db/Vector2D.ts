export default class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  addScalar(scalar: number): Vector2D {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  add(b: Vector2D): Vector2D {
    this.x += b.x;
    this.y += b.y;
    return this;
  }

  multiplyScalar(scalar: number): Vector2D {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  distanceTo(b: Vector2D): number {
    return Math.hypot(b.x - this.x, b.y - this.y);
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-method-length
  length(): number {
    return Math.hypot(this.x, this.y);
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-method-normalized
  normalized(): Vector2D {
    const len = this.length();
    if (len === 0) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-method-dot
  dot(b: Vector2D): number {
    return this.x * b.x + this.y * b.y;
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-method-limit-length
  limitLength(length: number): Vector2D {
    const mag = this.length();
    if (mag > length) {
      this.x = (this.x / mag) * length;
      this.y = (this.y / mag) * length;
    }
    return this;
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-operator-dif-vector2
  subtract(b: Vector2D): Vector2D {
    this.x -= b.x;
    this.y -= b.y;
    return this;
  }

  static zero(): Vector2D {
    return new Vector2D(0, 0);
  }

  project(orthogonal: Vector2D): Vector2D {
    const dot = this.dot(orthogonal);
    const mag = orthogonal.length();
    this.x = dot / mag;
    this.y = dot / mag;
    return this;
  }

  orthogonal(): Vector2D {
    const tempX = this.x;
    this.x = -this.y;
    this.y = tempX;
    return this;
  }

  angleTo(other: Vector2D): number {
    const dot = this.dot(other);
    const mag = this.length() * other.length();
    return Math.acos(dot / mag);
  }

  rotated(angle: number): Vector2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tempX = this.x;
    this.x = this.x * cos - this.y * sin;
    this.y = tempX * sin + this.y * cos;
    return this;
  }
}

export function extendSegmentEnd(
  p1: Vector2D,
  p2: Vector2D,
  extension: number,
): Vector2D {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  const newX2 = p2.x + (dx / length) * extension;
  const newY2 = p2.y + (dy / length) * extension;

  return new Vector2D(newX2, newY2);
}
