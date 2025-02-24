import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { po } from 'gettext-parser';
const { ccclass, property } = _decorator;

const Pos:Vec3 = new Vec3();

@ccclass('enemy')
export class enemy extends Component {
    @property(Vec3)
    dir:Vec3 = new Vec3();

    _canMove = true;

    getEnemyDir(){
        return this.dir;
    }

    update(deltaTime: number) {
        if(!this._canMove) return;
        this.node.getWorldPosition(Pos);
        let dir = this.dir.clone();
        Pos.add(dir.multiplyScalar(deltaTime));
        this.node.setWorldPosition(Pos);
    }

    pause(){
        this._canMove = false;
    }
}


