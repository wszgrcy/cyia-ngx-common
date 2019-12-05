import { Entity, PrimaryColumn, OneToOne } from '../../decorator/entity';
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/chain1212'
  }
})
export class OneTOneChainP3Entity {
  @PrimaryColumn()
  id;
  param;
}

@Entity({
  request: {
    url: 'http://127.0.0.1:3000/chain1211'
  }
})
export class OneTOneChainP2Entity {
  @PrimaryColumn()
  id;
  @OneToOne(() => OneTOneChainP3Entity)
  thrid: OneTOneChainP3Entity;
  param;
}

@Entity({
  request: {
    url: 'http://127.0.0.1:3000/chain1210'
  }
})
export class OneTOneChainEntity {
  @PrimaryColumn()
  id;
  @OneToOne(() => OneTOneChainP2Entity)
  second: OneTOneChainP2Entity;
  param;
}
