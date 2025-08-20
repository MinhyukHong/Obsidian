---
review date: 2025-08-19
conference: IEEE S&P 2025
reading: true
done: 
summary:
---
## Abstract
---
- 로컬 네트워크 액세스로부터 보안과 프라이버시 문제를 완화시키기 위해 애플은 새로운 permission을 도입한 iOS 14를 출시하였다.
- 4가지 양상 연구를 통해 로컬 네트워크 Permission에 대한 종합 분석을 실시한다.
	- 시스템적으로 로컬 네트워크에 액세스하는 보안 측면에서의 구현을 조사한다.
	- 10,862 개의 iOS, Android 앱을 대상으로 대규모의 동적 분석을 통해 로컬 네트워크 액세스에 대해 탐색한다.
	- 사용자가 결정을 내리기 전에 정보를 얻는 프로세스인 permission 프롬프트를 구성하는 개념에 대해 분석한다.
	- 식별된 개념에 대해 온라인 조사(N = 150)를 실시한다. 이를 통해 사용자의 permission에 대한 이해도와 위협에 대한 인식, 일반적인 오해를 파악한다.


## 1. Introduction
---
- 앱이 로컬 네트워크에 액세스 할 수 있다면 새로운 공격 벡터를 열며 디바이스와도 통신할 수 있다.
	- 따라서 개인의 로컬 네트워크의 정보를 수집하는 것은 추적 및 사용자 프로파일링을 할 수 있도록 한다.
- 로컬 네트워크 permissions 구현에 대한 주제는 이전에 이미 연구되었다.
	- Youtube가 로컬 네트워크 permission을 우회한다는 사용자들의 우려도 있었다.
		- 이는 애플의 AirPlay 기능을 사용함에 있어서 야기된 것인데, 이 기능은 permission을 요구하지 않는다.
	- 하지만 허가되지 않은 액세스는 가능하고, 더 나아가 로컬 네트워크 액세스가 얼마나 널리 퍼져 있는지, 그리고 충분한 permission이 없어 앱이 안드로이드에서는 다르게 행동하는 케이스가 불분명하다.
- 위와 같은 간극을 채우기 위해서, 이 논문에서는 ==기술과 사용자 관점 두 가지의 학술적인 접근방식을 사용==하는 것을 제안한다.
	- ==포괄적 평가==
		- 기능의 보안과 프라이버시
		- 앱이 로컬 네트워크에 액세스하는 법
		- 앱이 사용자를 유도하는 법
		- permisson에 대한 사용자의 이해
- permission이 보안상 안전하게 설계되어 있지 않는다면 보안과 프라이버시에 있어 false sense가 존재할 수 있다.
- 마찬다지로, 사용자가 정보에 입각한 결정을 내리지 못 한다면, 악성 앱들은 사용자들이 권한을 부여하도록 이끈다.

![Figure 1](ios_local_network_F01.png)

- *RQ1: Is the local network permission implemented securely?*
	- permission 구현이 안전한지, 혹은 우회가 가능한지.
	- 로컬 네트워크에 시스템적으로 액세스하여 잠재적인 간극을 찾는다.
- *RQ2: How prevalent is local network access in apps?*
	- 앱에서의 로컬 네트워크 액세스가 얼마나 많이 퍼져 있는지, iOS와 안드로이드 두 운영체제에서 가용한 앱들을 실행함으로써 모니터링하는 대규모 분석 실행.
	- 10,862개 앱을 ==동적 분석==
- *RQ3: Which concepts constitute the permission prompts?*
	- permission 프롬프트의 정보를 조사.
	- 이는 개발자들이 액세스가 요청되는 이유를 설명하는 이론적 근거를 제공하는 현주소이다.
- *RQ4: What is the user's understanding of these concepts?*
	- 150명 대상의 온라인 사용자 설문조사: 로컬 네트워크 permission과 이를 통한 위협에 대한 사용자의 인식을 이해하기 위함
- **Contributions**:
	- permission을 우회하는 2가지 방법 증명 및 permission의 보호된 로컬 주소의 범위가 불충분함
	- 10,862개 cross-platform 앱 분석: 152 iOS, 117 안드로이드 앱이 로컬 네트워크의 액세스 및 양 플랫폼 간의 차이점을 보여줌
	- permission 프롬프트 내의 reoccurring concepts를 식별 및 개발자에게 명시된 목적에 대한 통찰력을 제시
	- 거의 모든 참가자(83.11%)가 적어도 한 가지 이상의 위협에 대해 인식하고 있지만, 오해 또한 널리 퍼져 있다(84.46%).


## 2. Background & Motivation
---



## Discussion
---
- 