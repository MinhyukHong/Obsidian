
### 문자열 정렬
---
[문자열을 정렬하는 문제](https://www.acmicpc.net/problem/1181)이다. 다만 단순히 사전순으로 정렬하는 것이 아니라 길이가 더 짧은 것을 출력하되, 길이가 같으면 그 때 사전 순으로 정렬하는 특징이 있다.

```
#include <iostream>
#include <algorithm>

using namespace std;

string a[20000];
int n;

bool compare(string a, string b) {
	// 길이가 짧은 단어
	if(a.length() < b.length())
		return 1;
	else if(a.length() > b.length())
		return 0;
	// 길이가 같은 경우 사전 순서
	else
		return a < b;
}

int main(void) {
	cin >> n;
	for(int i = 0; i < n; i++) {
		cin >> a[i];
	}
	sort(a, a + n, compare);
	for(int i = 0; i < n; i++) {
		// 동일 단어 패스
		if(i > 0 && a[i] == a[i - 1]) continue;
		cout << a[i] << '\n';
	}
	return 0;
}
```


### 문자열 정렬 - Advanced
---
[조금 더 복잡한 정렬을 요구](https://www.acmicpc.net/problem/1431)한다.

```
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int n;
vector <string> v;

int getSum(string a) {
	int n = a.length(), sum = 0;
	for(int i = 0; i < n; i++) {
		// 숫자인 경우 합산
		if(a[i] - '0' <= 9 && a[i] - '0' >= 0) {
			sum += a[i] - '0';
		}
	}
	return sum;
}

bool compare(string a, string b) {
	// 길이 순서 정렬
	if(a.length() != b.length()) {
		return a.length() < b.length();
	}
	else {
		int aSum = getSum(a);
		int bSum = getSum(b);
		// 글자에 포함된 숫자 합으로 정렬
		if(aSum != bSum) {
			return aSum < bSum;
		}
		// 사전 순서 정렬
		else return a < b;
	}
}

int main() {
	cin >> n;
	string input;
	for(int i = 0; i < n; i++) {
		cin >> input;
		v.push_back(input);
	}
	sort(v.begin(), v.end(), compare);
	for(int i = 0; i < n; i++) {
		cout << v[i] << endl;
	}
	return 0;
}
```


### 빠르게 정렬
---
[시간 복잡도 O(N)을 요구하는 정렬  문제](https://www.acmicpc.net/problem/10989)이다. **숫자의 범위가 정해져 있을 때**만 매우 빠르게 계산해 낼 수 있는 계수 정렬 알고리즘을 사용한다.

```
#include <iostream>

using namespace std;

int n, m;
int a[10001];

int main() {
	scanf("%d", &n);
	for(int i = 0; i < n; i++) {
		scanf("%d", &m);
		a[m]++;
	}
	for(int i = 0; i < 10001; i++) {
		while(a[i] != 0) {
			printf("%d\n" i);
			a[i]--;
		}
	}
}
```
