/// <reference path="./CardApp.ts" />


new Controllers.CardApp().print();

initialize();

function initialize() {
    const container = document.getElementById('card-container')
    if (container)
        reSortable(container);
}

function reSortable(container: HTMLElement) {
    var dragEl: HTMLElement;
    var lastTarget: HTMLElement | null;
    var lastNext: boolean;

    if (container == null)
        return;

    Array.from(container.children).forEach(item => {
        (item as HTMLElement).draggable = true
    });

    container.addEventListener('dragstart', function (e: DragEvent) {
        if (!e.ctrlKey) {
            e.preventDefault();
            return;
        }

        dragEl = <HTMLElement>e.target;
        lastTarget = null;

        if (e.dataTransfer)
            e.dataTransfer.effectAllowed = 'move';

        container.addEventListener('dragover', _onDragOver, false);
        container.addEventListener('dragend', _onDragEnd, false);
    });

    function _onDragOver(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer)
            e.dataTransfer.dropEffect = 'move';

        if (_handleDragOver(e))
            removeShifts();
    }

    function _handleDragOver(e: DragEvent) {
        var target = <HTMLElement>e.target;
        if (!target)
            return false;

        if (target.classList.contains('card'))
            target = <HTMLElement>target.parentNode;
        else if (!target.classList.contains('card-box'))
            return false;

        if (target === dragEl)
            return true;

        var next = _wouldInsertAfter(target, e);

        if (_wouldInsertOnInitialPosition(target, next))
            return true;


        if (target !== lastTarget || next !== lastNext) {
            if (_isSamePosition(target, next)) {
                lastTarget = target;
                lastNext = next;
                return false;
            }

            // update
            lastTarget = target;
            lastNext = next;

            removeShifts();

            // set new 
            target.classList.add("shifted");
            if (next) {
                target.style.left = "-25px";

                var nextElement = nextCardBox(target);
                if (nextElement) {
                    nextElement.classList.add("shifted");
                    nextElement.style.left = "25px";
                }
            } else {
                target.style.left = "25px";
                var prevElement = <HTMLElement>Array.from(container.children).find(e => { return nextCardBox(<HTMLElement>e) === target });
                if (prevElement) {
                    prevElement.classList.add("shifted");
                    prevElement.style.left = "-25px";
                }
            }
        }

        return false;
    }

    function _wouldInsertAfter(target: HTMLElement, e: DragEvent) {
        var targetPos = target.getBoundingClientRect();
        return (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > 0.5;
    }

    function _wouldInsertOnInitialPosition(target: HTMLElement, next: boolean) {
        return (next && nextCardBox(target) == dragEl) ||
            (!next && nextCardBox(dragEl) == target)
    }

    function _isSamePosition(target: HTMLElement, next: boolean) {
        return lastTarget && (
            (lastNext && nextCardBox(lastTarget) === target && !next) ||
            (next && nextCardBox(target) === lastTarget && !lastNext)
        )
    }

    function _onDragEnd(evt: DragEvent) {
        evt.preventDefault();
        removeShifts();

        var newPos = Array.from(container.children).map(child => {
            let pos = document.getElementById(child.id)?.getBoundingClientRect();
            return pos;
        });
        console.log(newPos);
        container.removeEventListener('dragover', _onDragOver, false);
        container.removeEventListener('dragend', _onDragEnd, false);
    }

    function removeShifts() {
        document.querySelectorAll(".shifted").forEach(e => {
            var he = <HTMLElement>e;
            e.classList.remove("shifted");
            he.style.left = "";
        })
    }

    function nextCardBox(cardBox: HTMLElement): HTMLElement | null {
        while (true) {
            cardBox = <HTMLElement>cardBox.nextSibling;
            if (!cardBox)
                return null;
            if (cardBox.classList && cardBox.classList.contains("card-box"))
                return cardBox
        }
    }

}

