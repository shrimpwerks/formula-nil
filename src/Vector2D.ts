export class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  addScalar(scalar: number): Vector2D {
    return new Vector2D(this.x + scalar, this.y + scalar);
  }

  add(b: Vector2D): Vector2D {
    return new Vector2D(this.x + b.x, this.y + b.y);
  }

  multiplyScalar(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
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
      return new Vector2D(0, 0);
    }

    return new Vector2D(this.x / len, this.y / len);
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-method-dot
  dot(b: Vector2D): number {
    return this.x * b.x + this.y * b.y;
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-method-limit-length
  limitLength(length: number): Vector2D {
    const mag = this.length();
    if (mag > length) {
      return new Vector2D((this.x / mag) * length, (this.y / mag) * length);
    }

    return this;
  }

  /// https://docs.godotengine.org/en/stable/classes/class_vector2.html#class-vector2-operator-dif-vector2
  subtract(b: Vector2D): Vector2D {
    return new Vector2D(this.x - b.x, this.y - b.y);
  }
}
