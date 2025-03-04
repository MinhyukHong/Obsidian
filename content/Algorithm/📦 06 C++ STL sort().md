

`sort()` 함수는 기본적으로 ==오름차순 정렬==을 수행한다. **배열의 시작점 주소와 마지막 주소**를 적으면 된다.

```
#include <iostream>
#include <algorithm>

using namespace std;

int main(void) {
	int a[10] = {9, 3, 5, 4, 1, 10, 8, 6, 7, 2};
	sort(a, a + 10);
	for(int i = 0; i < 10; i++) {
		cout << a[i] << ' ';
	}
}
```


다음은 정렬 기준을 직접 실정하는 것이다. `sort()` 함수가 강력한 이유는 정렬의 기준을 개발자 의도대로 정의할 수 있다는 이유에서이다. 정렬 기준을 함수로 정의하여, 해당 함수를 `sort()` 내부 파라미터로 넣어 줌으로써 정렬을 의도한대로 작동시킬 수 있는 것이다.
다음은 **내림차순 정렬**의 간단한 예시이다.

```
#include <iostream>
#include <algorithm>

using namespace std;

bool compare(int a, int b) {
	return a > b;
}

int main(void) {
	int a[10] = {9, 3, 5, 4, 1, 10, 8, 6, 7, 2};
	sort(a, a + 10, compare);
	for(int i = 0; i < 10; i++) {
		cout << a[i] << ' ';
	}
}
```


> **데이터를 묶어서 정렬하는 방법**
> 기본적으로 위와 같은 단순 데이터 정렬 기법은 실무에서 사용하기에 적합하지 않다. 실무에서 프로그래밍을 할 때는 모든 데이터들이 객체로 정리되어 내부적으로 여러 개의 변수를 포함하고 있기 때문이다. 이 경우 가장 중요한 정렬 방식은 *'특정한 변수를 기준으로'* 정렬하는 것이다.

```
#include <iostream>
#include <algorithm>

using namespace std;

class Student {
public:
	string name;
	int score;
	Student(string name, int score) {
		this->name = name;
		this->score = score;
	}
	// 정렬 기준: 점수가 작은 순서
	bool operator <(Student &student) {
		return this->score < student.score;
	}
};

bool compare(int a, int b) {
	return a > b;
}

int main(void) {
	Student students[] = {
		Student("John", 90);
		Student("Jack", 93);
		Student("Min", 97);
		Student("Peter", 87);
		Student("Harry", 92);
	};
	sort(students, students + 5);
	for(int i = 0; i < 5; i++) {
		cout << students[i].name << ' ';
	}
}
```

위에서는 Class를 정의해서 여러 개의 변수가 존재하는 상황에서 '특정한 변수'를 기준으로 정렬하는 방법을 다뤘다. 다만 클래스를 정의하는 방식은 프로그래밍 속도 측면에서 별로 유리하지 않다. 실제 대회에서 문제 하나를 풀기 위해 클래스를 정의하고 있는 것은 적절치 못하다.
클래스 방식은 실무에 적합하고, 일반적인 빠른 개발이 필요할 때는 `Pair` 라이브러리를 사용하는 것이 더 효율적이다.

```
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main(void) {
	vector<pair<int, string> > v;
	v.push_back(pair<int, string>(90, "John"));
	v.push_back(pair<int, string>(85, "Jack"));
	v.push_back(pair<int, string>(82, "Min"));
	v.push_back(pair<int, string>(98, "Peter"));
	v.push_back(pair<int, string>(79, "Harry"));
	
	sort(v.begin(), v.end());
	for(int i = 0; i < v.size(); i++) {
		cout << v[i].second << ' ';
	}
	return 0;
}
```

