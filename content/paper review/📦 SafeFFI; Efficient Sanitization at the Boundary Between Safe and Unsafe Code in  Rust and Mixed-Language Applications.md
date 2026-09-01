---
review date: 2026-05-02
conference: Usenix Security 2026
reading: true
done:
summary:
---
## Abstract

- 안전하지 않은 Rust 코드는 C/C++ 라이브러리들과의 상호운용성과 low-level 자료구조 구현을 위해 필요하다. 하지만 이는 메모리 안전성을 위반할 수 있다.
- sanitizer는 런타임에서 메모리 에러를 잡아낼 수 있지만 불필요한 검증을 수행하곤 한다.
- SafeFFI: 안전하거나 안전하지 않은 코드의 경계 사이에서 검사가 이루어지도록 Rust 바이너리에서 메모리 안전성을 최적화하고 메모리 안전성 강화를 Rust 유형 시스템으로 넘긴다.
---

## 1. Introduction

- C/C++ 언어에서는 대부분의 버그가 메모리 관련으로 발생한다. (70%, memory unsafety)
- 최근 몇 년 동안 Rust는 safe-by construction으로 주목을 받았다.
- C/C++ 레거시 코드를 Rust로 탈바꿈하려던 시도에도 불구하고, C/C++ 코드에 여전히 의존할 가능성이 다분하다.
- 실제로 Rust 애플리케이션은 외부 함수 인터페이스(FFI)를 통해 C/C++ 코드에 연결된 혼합 언어 애플리케이션(MLA)일 수 있으며, 그 반대도 마찬가지이다.
	- 따라서 Rust의 safety 보장은 안전하지 않은 외부 코드로부터 손상될 수 있다.
	- 


## Discussion

- 