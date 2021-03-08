reSortable(document.getElementById('container'));

function reSortable(container) {
    var dragEl, lastTarget, lastNext;



    [...container.children].forEach(item => {
        item.draggable = true
    });

    container.addEventListener('dragstart', function (e) {
        dragEl = e.target;
        lastTarget = null;

        e.dataTransfer.effectAllowed = 'move';

        container.addEventListener('dragover', _onDragOver, false);
        container.addEventListener('dragend', _onDragEnd, false);
    });

    function _onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (_handleDragOver(e))
            removeShifts();
    }

    function _handleDragOver(e) {
        var target = e.target;
        if (!target)
            return false;

        if (target.classList.contains('card'))
            target = target.parentNode;
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
                target.style.left="25px";
                var prevElement = [...container.children].find(e => { return nextCardBox(e) === target });
                if (prevElement) {
                    prevElement.classList.add("shifted");
                    prevElement.style.left = "-25px";
                }
            }
        }

        return false;
    }

    function _wouldInsertAfter(target, e) {
        var targetPos = target.getBoundingClientRect();
        return (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > 0.5;
    }

    function _wouldInsertOnInitialPosition(target, next) {
        return (next && nextCardBox(target) == dragEl) ||
            (!next && nextCardBox(dragEl) == target)
    }

    function _isSamePosition(target, next) {
        return lastTarget && (
            (lastNext && nextCardBox(lastTarget) === target && !next) ||
            (next && nextCardBox(target) === lastTarget && !lastNext)
        )
    }

    function _onDragEnd(evt) {
        evt.preventDefault();
        removeShifts();

        newPos = [...container.children].map(child => {
            let pos = document.getElementById(child.id).getBoundingClientRect();
            return pos;
        });
        console.log(newPos);
        container.removeEventListener('dragover', _onDragOver, false);
        container.removeEventListener('dragend', _onDragEnd, false);
    }

    function removeShifts() {
        document.querySelectorAll(".shifted").forEach(e => {
            e.classList.remove("shifted");
            e.style.left = null;
        })
    }

    function nextCardBox(cardBox) {
        while (true) {
            cardBox = cardBox.nextSibling;
            if (!cardBox)
                return null;
            if (cardBox.classList && cardBox.classList.contains("card-box"))
                return cardBox
        }
    }

}


