
깊이 우선 탐색(Depth First Search)은 탐색을 함에 있어서 보다 깊은 것을 우선적으로 하여 탐색하는 알고리즘이다. 이는 맹목적으로 각 노드를 탐색할 때 주로 사용된다. BFS에서는 queue가 사용되었다면 DFS에서는 ==Stack==이 사용된다. 하지만 스택을 사용하지 않아도 구현은 가능한데, 그 이유는 컴퓨터는 구조적으로 항상 *스택의 원리를 사용* 하기 때문이다.

```
#include <iostream>
#include <vector>

using namespace std;

int number = 7;
int c[8];
vector<int> a[8];

void dfs(int x) {
	if(c[x]) return;
	c[x] = true;
	cout << x << ' ';
	for(int i = 0; i < a[x].size(); i++) {
		int y = a[x][i];
		dfs(y);
	}
}

int main() {
	// 각 노드를 연결
	a[1].push_back(2);
	a[2].push_back(1);
	
	a[1].push_back(3);
	a[3].push_back(1);
	
	a[2].push_back(3);
	a[3].push_back(2);
	
	a[2].push_back(4);
	a[4].push_back(2);
	
	a[2].push_back(5);
	a[5].push_back(2);
	
	a[3].push_back(6);
	a[6].push_back(3);
	
	a[3].push_back(7);
	a[7].push_back(3);
	
	a[4].push_back(5);
	a[5].push_back(4);
	
	a[6].push_back(7);
	a[7].push_back(6);
	
	// DFS 수행
	dfs(1);
	return 0;
}
```

위 소스코드에서는 스택을 직접 사용하지 않고 *Recursion을 이용* 하여 간략하게 함수를 구현했다.