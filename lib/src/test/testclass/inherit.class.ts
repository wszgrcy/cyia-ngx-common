import { Entity } from '../../decorator/entity/entity.decorator';
import { PrimaryColumn } from '../../decorator/entity/columns/primary-column.decorator';
import { One21P2Entity } from './base.class';
import { OneToOne } from '../../decorator/entity/property/one-to-one.decorator';

// import { Entity, PrimaryColumn } from ".";

@Entity({
    request: {
        url: 'http://127.0.0.1:3000/t1',
        method: 'get',
    }
})
export class OriginEntity {
    @PrimaryColumn()
    id;
    @OneToOne(() => One21P2Entity)
    p2;
}
@Entity({
    request: {
        url: 'http://127.0.0.1:3000/mainwithonetoone',
        method: 'get',
    },
    // reserve: ['url']
})
export class InheritEntity extends OriginEntity {

}

