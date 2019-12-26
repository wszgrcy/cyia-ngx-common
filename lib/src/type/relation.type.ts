export enum RelationType {
  OneToOne = 1,
  OneToMany = 1 << 1,
  ManyToOne = 1 << 2,
  ManyToMany = 1 << 3
}
