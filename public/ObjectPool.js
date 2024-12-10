// ObjectPool.js

class ObjectPool {
    constructor(createFunc, maxSize = 100) {
        this.createFunc = createFunc; // Function to create a new object
        this.pool = [];
        this.maxSize = maxSize;
    }

    acquire() {
        return this.pool.length > 0 ? this.pool.pop() : this.createFunc();
    }

    release(obj) {
        if (this.pool.length < this.maxSize) {
            this.pool.push(obj);
        } else {
            // Optionally dispose of the object if pool is full
            if (obj.geometry) obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
                obj.material.forEach(mat => mat.dispose());
            } else if (obj.material) {
                obj.material.dispose();
            }
        }
    }

    clear() {
        while (this.pool.length > 0) {
            const obj = this.pool.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
                obj.material.forEach(mat => mat.dispose());
            } else if (obj.material) {
                obj.material.dispose();
            }
        }
    }
}

export default ObjectPool;
