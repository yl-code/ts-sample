export class TreeNode<T> {
  // left: TreeNode<T>;
  // right: TreeNode<T>;
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
function log(x: unknown) {
  console.log(x);
}
const node = new TreeNode(100);
log(node.data);
